import React from "react";
import { ProductGridSkeleton } from "@/components/ui/products";

/**
 * Luxury dark glassmorphism skeleton loader for initial page streaming.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 flex flex-col gap-8 sm:gap-14 lg:gap-20 overflow-hidden pb-12 sm:pb-16 lg:pb-20 animate-pulse">
      {/* ==================== HERO SECTION SKELETON ==================== */}
      <section className="relative w-full h-[80vh] min-h-[500px] sm:h-[88vh] sm:min-h-[580px] max-h-[860px] bg-[#120f0e] border-b border-primary/10 flex items-center justify-center overflow-hidden">
        {/* AMBIENT RADIAL GLOW SKELETON */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        {/* HERO CONTENT PLACEHOLDERS */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
          {/* BADGE SKELETON */}
          <div className="w-44 h-7 rounded-full bg-white/5 border border-primary/20" />

          {/* MAIN HEADING SKELETON */}
          <div className="space-y-2.5 flex flex-col items-center">
            <div className="w-64 sm:w-96 md:w-[480px] h-9 sm:h-12 md:h-14 rounded-2xl bg-white/10" />
            <div className="w-48 sm:w-72 md:w-80 h-8 sm:h-11 md:h-12 rounded-2xl bg-primary/20" />
          </div>

          {/* DESCRIPTION SKELETON */}
          <div className="space-y-2 flex flex-col items-center pt-1">
            <div className="w-72 sm:w-[500px] md:w-[600px] h-4 rounded bg-white/5" />
            <div className="w-56 sm:w-80 md:w-96 h-4 rounded bg-white/5" />
          </div>

          {/* CTA BUTTONS SKELETON */}
          <div className="flex flex-row items-center gap-3 pt-2">
            <div className="w-36 sm:w-44 h-11 sm:h-13 rounded-full bg-primary/30" />
            <div className="w-32 sm:w-36 h-11 sm:h-13 rounded-full bg-white/5 border border-white/10" />
          </div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS SECTION SKELETON ==================== */}
      <section className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        {/* HEADING SKELETON */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-24 h-4 rounded bg-primary/20" />
          <div className="w-64 h-8 rounded-xl bg-white/10" />
        </div>

        {/* SEARCH BAR SKELETON */}
        <div className="w-full max-w-2xl mx-auto h-12 rounded-full bg-white/5 border border-primary/20" />

        {/* PRODUCT GRID SKELETON */}
        <ProductGridSkeleton count={4} />

        {/* NAVIGATION BUTTON SKELETON */}
        <div className="flex justify-center pt-2">
          <div className="w-48 h-10 rounded-full bg-white/5 border border-white/10" />
        </div>
      </section>

      {/* ==================== PARALLAX BRAND STATEMENT SKELETON ==================== */}
      <section className="relative w-full py-20 sm:py-28 bg-[#14110f] border-y border-white/5 flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-3 px-4">
          <div className="w-32 h-3.5 rounded bg-primary/20" />
          <div className="w-80 sm:w-96 h-8 rounded-xl bg-white/10" />
          <div className="w-64 h-4 rounded bg-white/5" />
        </div>
      </section>

      {/* ==================== PACKAGES SECTION SKELETON ==================== */}
      <section className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto w-full">
        {/* HEADING SKELETON */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-28 h-4 rounded bg-primary/20" />
          <div className="w-64 h-8 rounded-xl bg-white/10" />
        </div>

        {/* PRODUCT GRID SKELETON */}
        <ProductGridSkeleton count={4} />
      </section>
    </div>
  );
}
