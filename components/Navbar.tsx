"use client";

import { useState, useEffect } from "react";
import { Search, HelpCircle, User, Menu, X } from "lucide-react";
import { experiences } from "@/lib/data";
import Link from "next/link";

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export default function Navbar({ onSearch, searchQuery = "" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<typeof experiences>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    if (val.trim().length > 1) {
      const filtered = experiences
        .filter(
          (exp) =>
            exp.title.toLowerCase().includes(val.toLowerCase()) ||
            exp.location.toLowerCase().includes(val.toLowerCase()) ||
            exp.category.toLowerCase().includes(val.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
    setShowSuggestions(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center">
              <span className="text-[#7c3aed] font-bold text-xl tracking-tight">
                ✈ headout
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={handleInputChange}
                  onFocus={() => localQuery.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search for experiences and cities"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-gray-50"
                />
              </div>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {suggestions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/experience/${s.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:block text-sm text-gray-600 font-medium">
              English / INR
            </span>
            <button className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors overflow-hidden">
              <User className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-purple-600 px-2 py-1 rounded-md hover:bg-purple-50 transition-colors whitespace-nowrap">
            <Menu className="w-3.5 h-3.5" />
            All Categories
          </button>
          {["Bestsellers", "Disneyland® Paris Tickets", "Bateaux Parisiens Cruises", "Eiffel Tower Tickets"].map((item) => (
            <button
              key={item}
              className="text-xs text-gray-600 hover:text-purple-600 px-3 py-1 rounded-md hover:bg-purple-50 transition-colors whitespace-nowrap font-medium"
            >
              {item}
            </button>
          ))}
          <div className="ml-auto">
            <button className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded-md whitespace-nowrap">
              Download app
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={localQuery}
                  onChange={handleInputChange}
                  placeholder="Search for experiences and cities"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-purple-400 bg-gray-50"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
