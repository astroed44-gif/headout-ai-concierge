import Image from "next/image";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { Experience } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Link href={`/experience/${experience.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {experience.freeCancellation && (
            <div className="absolute top-3 left-3">
              <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                Free cancellation
              </span>
            </div>
          )}
          {experience.discount && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                {experience.discount}% off
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 capitalize">{experience.category.replace(/-/g, " ")}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-gray-700">{experience.rating}</span>
              <span className="text-xs text-gray-400">({experience.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {experience.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{experience.duration}</span>
            </div>
            <div className="text-right">
              {experience.originalPrice && (
                <p className="text-xs text-gray-400 line-through">
                  {formatPrice(experience.originalPrice)}
                </p>
              )}
              <p className="text-sm font-bold text-gray-900">
                <span className="text-xs font-normal text-gray-500 mr-0.5">from</span>
                {formatPrice(experience.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
