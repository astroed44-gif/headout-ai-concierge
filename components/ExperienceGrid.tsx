"use client";

import { Experience } from "@/lib/data";
import ExperienceCard from "./ExperienceCard";
import ExperienceCardSkeleton from "./ExperienceCardSkeleton";

interface ExperienceGridProps {
  experiences: Experience[];
  title?: string;
  loading?: boolean;
}

export default function ExperienceGrid({ experiences, title, loading }: ExperienceGridProps) {
  if (loading) {
    return (
      <div>
        {title && (
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-6" />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ExperienceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No experiences found</h3>
        <p className="text-gray-500">Try searching for something else or browse all categories.</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
}
