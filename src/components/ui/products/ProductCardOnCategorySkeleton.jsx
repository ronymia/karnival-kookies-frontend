import React from "react";

/**
 * Horizontal luxury skeleton for ProductCardOnCategory.
 */
export default function ProductCardOnCategorySkeleton() {
  return (
    <div className="relative flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-[#161311]/80 backdrop-blur-md border border-primary/15 shadow-md overflow-hidden animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 shrink-0" />

      {/* CONTENT PLACEHOLDERS */}
      <div className="flex flex-col gap-2 grow justify-between">
        <div className="space-y-1.5">
          <div className="w-28 h-3.5 rounded bg-white/10" />
          <div className="w-full h-2.5 rounded bg-white/5 max-w-[180px]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-4 rounded bg-primary/25" />
          <div className="w-8 h-3 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}
