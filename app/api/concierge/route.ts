import { NextRequest, NextResponse } from "next/server";
import { generateConciergeMessage } from "@/lib/concierge-brain";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { query, memory, textHistory } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "No API Key found" }, { status: 500 });
    }

    // AUTHENTIC ANTIGRAVITY REASONING
    const messages = generateConciergeMessage(query, memory, textHistory || "") as any[];
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message?.content;
    if (!content) throw new Error("No response from AI");

    const result = JSON.parse(content);

    // AI may update memory internally - merge it with current state
    const mergedMemory = {
      ...memory,
      ...(result.memory_update || {})
    };

    if (result.questions_asked_so_far !== undefined) {
      mergedMemory.questions_asked_so_far = result.questions_asked_so_far;
    }

    return NextResponse.json({ ...result, memory_update: mergedMemory });

  } catch (err) {
    console.error("[Antigravity Brain Error]:", err);
    return NextResponse.json({ 
      error: "Brain reasoning failed", 
      details: String(err),
      // Fallback message for UI
      stage: "recommendation",
      cards: [],
      text: "I'm having a small brain-freeze 🧊 Please try again in a moment!"
    }, { status: 502 });
  }
}
