"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 py-12 md:py-16">
          {/* Left Content */}
          <div className="flex-1 max-w-lg">
            <p className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wide">
              Paris, France
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Discover the best things to do in{" "}
              <span className="text-purple-600">Paris</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              A curated collection of the city&apos;s top-rated tours, iconic
              attractions, and unmissable things to do.
            </p>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden p-1 sm:pr-2">
                <Search className="absolute left-4 sm:left-5 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for experiences, cities..."
                  className="flex-1 w-[50%] pl-10 sm:pl-14 pr-2 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base focus:outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm transition-colors ml-auto mr-1 sm:mr-0"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Eiffel Tower", "Disneyland Paris", "Louvre", "Seine Cruise"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); onSearch(tag); }}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 max-w-lg w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="/images/eiffel-tower.png"
                alt="Paris - Eiffel Tower"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
