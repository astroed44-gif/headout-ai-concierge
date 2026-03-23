import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, MapPin, CheckCircle, ChevronLeft, Users, ArrowRight } from "lucide-react";
import { experiences } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIConciergeButton from "@/components/AIConciergeButton";
import ExperienceCard from "@/components/ExperienceCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return experiences.map(e => ({ slug: e.slug }));
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const exp = experiences.find(e => e.slug === slug);
  if (!exp) notFound();

  const related = experiences
    .filter(e => e.category === exp.category && e.id !== exp.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-[104px]">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/" className="hover:text-purple-600 transition-colors capitalize">
              {exp.category.replace(/-/g, " ")}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium line-clamp-1">{exp.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{exp.title}</h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= Math.floor(exp.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800">{exp.rating}</span>
                  <span className="text-gray-500 text-sm">({exp.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{exp.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{exp.location}, {exp.area}</span>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-3 mb-8 rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3] col-span-2 sm:col-span-1">
                  <Image
                    src={exp.images[0]}
                    alt={exp.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="hidden sm:grid grid-rows-2 gap-3">
                  {exp.images.slice(1, 3).map((img, i) => (
                    <div key={i} className="relative">
                      <Image
                        src={img}
                        alt={`${exp.title} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                  {exp.images.length < 3 && (
                    <div className="relative bg-gray-100" />
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-8">
                {exp.freeCancellation && (
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
                    <CheckCircle className="w-4 h-4" />
                    Free cancellation
                  </span>
                )}
                {exp.discount && (
                  <span className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-100">
                    {exp.discount}% off
                  </span>
                )}
                <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-100 capitalize">
                  {exp.category.replace(/-/g, " ")}
                </span>
              </div>

              {/* Description */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About this experience</h2>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </section>

              {/* Highlights */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Highlights</h2>
                <ul className="space-y-3">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Sidebar - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-5">
                    <p className="text-purple-200 text-xs uppercase tracking-wide mb-1">Starting from</p>
                    {exp.originalPrice && (
                      <p className="text-purple-300 line-through text-sm">{formatPrice(exp.originalPrice)}</p>
                    )}
                    <p className="text-3xl font-bold">{formatPrice(exp.price)}</p>
                    <p className="text-purple-200 text-xs mt-1">per person</p>
                    {exp.discount && (
                      <span className="inline-block mt-2 bg-green-400 text-green-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        Save {exp.discount}%
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>Duration: <strong className="text-gray-800">{exp.duration}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Location: <strong className="text-gray-800">{exp.area}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Group size: <strong className="text-gray-800">Up to 20</strong></span>
                      </div>
                    </div>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base mb-3 shadow-lg shadow-purple-200">
                      Book Now
                    </button>
                    <button className="w-full border-2 border-gray-200 hover:border-purple-400 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                      Check Availability
                    </button>

                    {exp.freeCancellation && (
                      <div className="flex items-center gap-2 mt-4 text-xs text-green-700 bg-green-50 rounded-lg p-2.5">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Free cancellation available — cancel anytime for a full refund</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-900">{exp.rating}</span>
                    <span className="text-gray-500 text-sm">/ 5.0</span>
                  </div>
                  <p className="text-xs text-gray-500">{exp.reviewCount.toLocaleString()} verified reviews from real travellers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Experiences */}
          {related.length > 0 && (
            <section className="mt-16 border-t border-gray-100 pt-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  More {exp.category.replace(/-/g, " ")} experiences
                </h2>
                <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-purple-600 flex items-center gap-1">
                  See all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map(r => (
                  <ExperienceCard key={r.id} experience={r} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
      <AIConciergeButton />
    </div>
  );
}
