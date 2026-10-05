"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

const POPULAR_TAGS = [
  "Chocolate",
  "Truffles",
  "Cookie Box",
  "Celebration Cakes",
];

const HomeSearchWrapper = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e?.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/shop-product?searchTerm=${encodeURIComponent(query)}`);
    } else {
      router.push("/shop-product");
    }
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    router.push(`/shop-product?searchTerm=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center gap-2.5">
      {/* SEARCH FORM */}
      <form
        onSubmit={handleSearch}
        role="search"
        className="relative flex items-center w-full bg-[#161311]/85 hover:bg-[#1a1614] backdrop-blur-md border border-primary/30 hover:border-primary/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-full transition-all duration-300 shadow-lg shadow-black/40 p-1 sm:p-1.5"
      >
        <div className="pl-3 sm:pl-3.5 pr-2 text-primary/70 pointer-events-none flex items-center shrink-0">
          <FiSearch className="text-base sm:text-lg" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cookies & sweets..."
          className="w-full bg-transparent text-xs sm:text-sm md:text-base text-neutral-100 placeholder-neutral-500 py-2 pr-20 sm:pr-24 focus:outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-neutral-400 hover:text-white p-1 mr-1 sm:mr-2 transition-colors cursor-pointer shrink-0"
            aria-label="Clear search"
          >
            <FiX className="text-sm sm:text-base" />
          </button>
        )}

        <button
          type="submit"
          className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-linear-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
        >
          Search
        </button>
      </form>

      {/* POPULAR QUICK TAGS (HORIZONTALLY SCROLLABLE ON MOBILE, CENTERED ON DESKTOP) */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full max-w-full px-1 py-1 text-xs text-neutral-400 justify-start sm:justify-center">
        <span className="text-neutral-500 font-medium shrink-0 pr-1">Popular:</span>
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-primary/15 border border-white/10 hover:border-primary/40 text-neutral-300 hover:text-primary transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeSearchWrapper;
