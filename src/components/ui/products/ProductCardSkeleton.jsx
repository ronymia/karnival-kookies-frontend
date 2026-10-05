import React from "react";

/**
 * Luxury dark glassmorphic skeleton for ProductCard.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-[#161311]/85 backdrop-blur-md border border-primary/15 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg overflow-hidden animate-pulse">
      {/* SHIMMER OVERLAY ACCENT */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      {/* TOP IMAGE PLACEHOLDER */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 mb-3.5 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
      </div>

      {/* PRODUCT INFO PLACEHOLDERS */}
      <div className="flex flex-col gap-2 grow justify-between">
        <div className="space-y-2">
          {/* CATEGORY TAG */}
          <div className="w-20 h-2.5 rounded bg-primary/20" />

          {/* TITLE */}
          <div className="w-3/4 h-4 rounded bg-white/10" />
        </div>

        {/* PRICING */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-16 h-5 rounded bg-primary/25" />
          <div className="w-10 h-3.5 rounded bg-white/5" />
        </div>

        {/* ADD TO CART BUTTON PLACEHOLDER */}
        <div className="w-full h-10 mt-2 rounded-xl bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}
