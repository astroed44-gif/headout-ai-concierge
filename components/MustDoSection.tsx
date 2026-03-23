import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { experiences } from "@/lib/data";

const mustDo = [
  experiences.find(e => e.slug === "disneyland-paris-1-day-ticket")!,
  experiences.find(e => e.slug === "eiffel-tower-summit-tickets")!,
  experiences.find(e => e.slug === "eiffel-tower-madame-brasserie-lunch")!,
  experiences.find(e => e.slug === "crazy-horse-paris-tickets")!,
].filter(Boolean);

export default function MustDoSection() {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Must do things in Paris</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mustDo.map((exp, i) => (
          <Link key={exp.id} href={`/experience/${exp.slug}`} className="group">
            <div className="flex items-start gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="112px"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-purple-600 transition-colors">
                    {exp.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 pl-8">{exp.description}</p>
                <div className="pl-8">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700">
                    See tickets <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <button className="px-8 py-3 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Show more
        </button>
      </div>
    </section>
  );
}
