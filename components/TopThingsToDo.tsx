import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

const featured = experiences.slice(0, 6);

export default function TopThingsToDo() {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top things to do in Paris</h2>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm font-semibold text-gray-700 hover:text-purple-600 underline underline-offset-2">
            See all
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {featured.map((exp) => (
          <Link key={exp.id} href={`/experience/${exp.slug}`} className="group">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </div>
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-0.5">{exp.title}</h3>
            <p className="text-xs text-gray-500">from {formatPrice(exp.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
