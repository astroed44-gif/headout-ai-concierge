"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCarousel from "@/components/CategoryCarousel";
import ExperienceGrid from "@/components/ExperienceGrid";
import TopThingsToDo from "@/components/TopThingsToDo";
import MustDoSection from "@/components/MustDoSection";
import DealsSection from "@/components/DealsSection";
import AIConciergeButton from "@/components/AIConciergeButton";
import Footer from "@/components/Footer";
import { experiences } from "@/lib/data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filtered = useMemo(() => {
    let result = experiences;
    if (selectedCategory) {
      result = result.filter(e => e.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        e =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  const isFiltering = !!searchQuery || !!selectedCategory;

  return (
    <div className="min-h-screen bg-white">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="pt-[104px]">
        {!isFiltering && <HeroSection onSearch={setSearchQuery} />}

        <CategoryCarousel
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isFiltering ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : `${selectedCategory.replace(/-/g, " ")} in Paris`}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{filtered.length} experiences found</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
                >
                  ← Clear filters
                </button>
              </div>
              <ExperienceGrid experiences={filtered} />
            </div>
          ) : (
            <>
              <ExperienceGrid
                experiences={experiences.slice(0, 8)}
                title="Top experiences in Paris"
              />
              <div className="border-t border-gray-100 my-2" />
              <TopThingsToDo />
              <div className="border-t border-gray-100 my-2" />
              <DealsSection />
              <div className="border-t border-gray-100 my-2" />
              <MustDoSection />
            </>
          )}
        </main>
      </div>

      <Footer />
      <AIConciergeButton />
    </div>
  );
}
