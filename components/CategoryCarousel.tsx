"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/lib/data";

interface CategoryCarouselProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryCarousel({ selectedCategory, onSelect }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-[104px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
          >
            <button
              onClick={() => onSelect("")}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === ""
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-400 hover:text-purple-600"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
