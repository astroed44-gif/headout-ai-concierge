"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, RotateCcw, RefreshCw, ExternalLink } from "lucide-react";
import Image from "next/image";

// ── Types ────────────────────────────────────────────────────────────────────

interface Memory {
  intent: Record<string, string>;
  answers: Record<string, string>;
  history: string[]; // Added: Booked Experiences IDs
  questions_asked_so_far?: number;
}

interface Card {
  title: string;
  price: string;
  why_it_fits: string;
  duration: string;
  tags: string[];
  image?: string;
}

type MessageKind =
  | { kind: "user"; text: string }
  | { kind: "ai-text"; text: string }
  | { kind: "ai-clarification"; questions: string[] }
  | { kind: "ai-cards"; cards: Card[] }
  | { kind: "ai-loading" };

// ── Webhook ───────────────────────────────────────────────────────────────────

const WEBHOOK_URL = "/api/concierge";

// ── Sub-components ────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function ClarificationButtons({
  questions,
  onSelect,
  disabled,
}: {
  questions: string[];
  onSelect: (q: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="text-sm px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

function ExperienceCard({ card }: { card: Card }) {
  // Pick a relevant placeholder based on keywords in title
  const getPlaceholder = () => {
    const t = card.title.toLowerCase();
    if (t.includes("disney") || t.includes("theme")) return "/images/disneyland-paris.png";
    if (t.includes("eiffel") || t.includes("tower")) return "/images/eiffel-tower.png";
    if (t.includes("louvre") || t.includes("museum") || t.includes("orsay")) return "/images/louvre.png";
    if (t.includes("versailles")) return "/images/versailles.png";
    if (t.includes("seine") || t.includes("cruise") || t.includes("boat")) return "/images/seine-river.png";
    if (t.includes("cabaret") || t.includes("moulin") || t.includes("show")) return "/images/cabaret.png";
    if (t.includes("food") || t.includes("cook") || t.includes("pastry")) return "/images/food-tour.png";
    if (t.includes("arc") || t.includes("catacomb") || t.includes("landmark")) return "/images/arc-de-triomphe.png";
    if (t.includes("aquarium")) return "/images/aquarium.png";
    return "/images/eiffel-tower.png";
  };

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-28 bg-gray-100">
        <Image
          src={card.image || getPlaceholder()}
          alt={card.title}
          fill
          className="object-cover"
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white text-xs font-bold drop-shadow">{card.price}</p>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {card.title}
        </h4>
        <div className="flex items-center gap-2 mb-1.5 opacity-80">
          <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">
            ⏳ {card.duration}
          </span>
          {card.tags && card.tags.length > 0 && (
            <span className="text-[10px] text-gray-500 font-medium truncate">
              {card.tags.join(" • ")}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          <span className="font-semibold">Why it fits:</span> {card.why_it_fits}
        </p>
        <a 
          href={`/experience/${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
        >
          View more
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function AIConciergeButton() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageKind[]>([
    {
      kind: "ai-text",
      text: "Hi! I'm your AI travel concierge ✨ Tell me where you are going and what you're looking for, and I'll find the perfect experience for you!",
    },
  ]);
  const [memory, setMemory] = useState<Memory>({ intent: {}, answers: {}, history: [], questions_asked_so_far: 0 });
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // ── API call ────────────────────────────────────────────────────────────────

  async function sendQuery(query: string, currentMemory: Memory, currentMessages: MessageKind[]) {
    setLoading(true);

    // Filter relevant user/ai text parts for context
    const textHistory = currentMessages
      .map(m => {
        if (m.kind === "user") return `User: ${m.text}`;
        if (m.kind === "ai-text") return `AI: ${m.text}`;
        return "";
      })
      .filter(Boolean)
      .join("\n");

    // Append loading indicator
    setMessages((prev) => [...prev, { kind: "ai-loading" }]);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, memory: currentMemory, textHistory }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Remove loading bubble
      setMessages((prev) => prev.filter((m) => m.kind !== "ai-loading"));

      // Handle clarification
      if (data.stage === "clarification") {
        const questionsText = Array.isArray(data.questions) 
          ? "\n\n" + data.questions.map((q: string) => `• ${q}`).join("\n")
          : "";
          
        setMessages((prev) => [
          ...prev,
          { 
            kind: "ai-text", 
            text: (data.text || "I'd love to help you find the perfect match. Could you let me know:") + questionsText 
          },
        ]);
        if (data.memory_update) setMemory(data.memory_update);
        return;
      }

      // Handle recommendation cards
      if (data.stage === "recommendation" && Array.isArray(data.cards)) {
        setMessages((prev) => [
          ...prev,
          { kind: "ai-text", text: data.text || "I've picked out some experiences you'll love!" },
          { kind: "ai-cards", cards: data.cards },
        ]);
        if (data.memory_update) setMemory(data.memory_update);
        return;
      }

      // n8n not active or misconfigured
      if ((data as Record<string, unknown>).error === "n8n_not_active") {
        setMessages((prev) => [
          ...prev,
          {
            kind: "ai-text" as const,
            text: "⚠️ **The n8n workflow isn't listening yet.** Click the **'Execute workflow'** button in your n8n canvas first, then try sending your message again!",
          },
        ]);
        return;
      }

      // Handle plain text response fallback
      if (data.message || data.text || data.response) {
        setMessages((prev) => [
          ...prev,
          { kind: "ai-text", text: data.message || data.text || data.response },
        ]);
        return;
      }

      // Unexpected shape — show raw JSON as fallback
      setMessages((prev) => [
        ...prev,
        {
          kind: "ai-text",
          text: "I received a response but couldn't parse it. Please try again.",
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev.filter((m) => m.kind !== "ai-loading"),
        {
          kind: "ai-text",
          text:
            err instanceof Error && err.message.includes("n8n_not_active")
              ? "⚠️ The AI workflow isn't active yet. Please activate the n8n workflow and ensure it's set to HTTP Method: POST, then try again."
              : "Sorry, I couldn't reach the server. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    const query = input.trim();
    if (!query || loading) return;
    setInput("");
    
    // Optimistic update
    const newMessages = [...messages, { kind: "user", text: query } as MessageKind];
    setMessages(newMessages);
    
    await sendQuery(query, memory, newMessages);
  };

  const handleClarificationSelect = async (answer: string) => {
    if (loading) return;

    // Save answer in memory
    const updatedMemory: Memory = {
      ...memory,
      answers: {
        ...memory.answers,
        [`q_${Object.keys(memory.answers).length + 1}`]: answer,
      },
    };
    setMemory(updatedMemory);

    // Show as user message
    // Provide the new state to sendQuery directly
    const newMessages = [...messages, { kind: "user", text: answer } as MessageKind];
    setMessages(newMessages);

    // Re-send with updated memory
    await sendQuery(answer, updatedMemory, newMessages);
  };

  const handleStartOver = () => {
    setMemory({ intent: {}, answers: {}, history: [], questions_asked_so_far: 0 });
    setMessages([
      {
        kind: "ai-text",
        text: "Let's start fresh! ✨ What kind of experience are you looking for and where?",
      },
    ]);
    setInput("");
  };

  const handleRefine = () => {
    setMessages((prev) => [
      ...prev,
      {
        kind: "ai-text",
        text: "Sure! Tell me more about what you're looking for and I'll refine the results.",
      },
    ]);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const hasCards = messages.some((m) => m.kind === "ai-cards");

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          id="ai-concierge-open-btn"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-xl flex items-center gap-2 px-5 py-3.5 font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          AI Concierge
        </button>
      )}

      {/* Chat Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex sm:items-center justify-end p-0 sm:p-6 bg-white sm:bg-transparent">
          {/* Backdrop (Desktop Only) */}
          <div
            className="hidden sm:block absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Chat Window */}
          <div
            className="relative bg-white flex flex-col overflow-hidden sm:shadow-2xl w-full h-full sm:w-[400px] sm:h-[680px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-purple-600 via-purple-600 to-purple-700 text-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-none">AI Travel Concierge</h3>
                  <p className="text-[11px] text-purple-200 mt-0.5">Your personal travel guide</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  id="ai-concierge-start-over-btn"
                  onClick={handleStartOver}
                  title="Start over"
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="ai-concierge-close-btn"
                  onClick={() => setOpen(false)}
                  className="hover:bg-white/20 rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => {
                if (msg.kind === "user") {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[80%] bg-purple-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                if (msg.kind === "ai-text") {
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="max-w-[82%] bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                if (msg.kind === "ai-cards") {
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
                          Here are my top picks for you! 🎉
                        </div>
                        {msg.cards.map((card, ci) => (
                          <ExperienceCard key={ci} card={card} />
                        ))}
                      </div>
                    </div>
                  );
                }

                if (msg.kind === "ai-loading") {
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm">
                        <LoadingDots />
                      </div>
                    </div>
                  );
                }

                return null;
              })}
              <div ref={bottomRef} />
            </div>

            {/* Bonus Action Buttons */}
            {hasCards && !loading && (
              <div className="px-4 pb-2 flex gap-2 flex-shrink-0">
                <button
                  id="ai-concierge-refine-btn"
                  onClick={handleRefine}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refine results
                </button>
                <button
                  id="ai-concierge-start-over-cards-btn"
                  onClick={handleStartOver}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start over
                </button>
              </div>
            )}

            {/* Quick Prompts (only at start) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
                {["Best for families", "Budget-friendly", "Romantic date ideas", "Skip the queues"].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setInput(p);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className="flex-shrink-0 text-xs px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full border border-purple-100 hover:bg-purple-100 transition-colors whitespace-nowrap"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  id="ai-concierge-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                  placeholder={loading ? "AI is thinking..." : "Ask about global experiences..."}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
                <button
                  id="ai-concierge-send-btn"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
