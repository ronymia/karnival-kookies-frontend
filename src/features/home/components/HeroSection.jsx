"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "motion/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: "/chocolate.jpg",
    badge: "Handcrafted Artisan Delights",
    title: "Rich Belgian Chocolate",
    highlight: "& Truffle Bites",
    description:
      "Crafted with pure single-origin cocoa, velvety ganache, and decadent golden dust for the ultimate luxury indulgence.",
    primaryCta: { text: "Order Sweet Box", href: "/shop-product" },
    secondaryCta: { text: "Explore Flavors", href: "/shop-product" },
  },
  {
    id: 2,
    image: "/cake.jpg",
    badge: "Baked Fresh Daily",
    title: "Signature Gourmet",
    highlight: "& Celebration Cakes",
    description:
      "Mouthwatering layered cakes baked fresh to order with premium Madagascar vanilla and rich buttercream frostings.",
    primaryCta: { text: "Explore Cakes", href: "/shop-product" },
    secondaryCta: { text: "Custom Orders", href: "/contacts" },
  },
  {
    id: 3,
    image: "/cherry.jpg",
    badge: "Seasonal Berry Specials",
    title: "Wild Black Cherry",
    highlight: "& Glazed Treats",
    description:
      "Sweet, tart, and sun-ripened berries folded into golden flaky pastries and creamy gourmet cookie doughs.",
    primaryCta: { text: "View Seasonal", href: "/shop-product" },
    secondaryCta: { text: "See Menu", href: "/shop-product" },
  },
  {
    id: 4,
    image: "/candy.jpg",
    badge: "Carnival Sweet Sensations",
    title: "Crispy Sugar Sprinkles",
    highlight: "& Carnival Flavors",
    description:
      "A joyful explosion of vibrant colors, crunchy textures, and nostalgic carnival flavors designed to brighten your day.",
    primaryCta: { text: "Shop Carnival Box", href: "/shop-product" },
    secondaryCta: { text: "Combo Packages", href: "/shop-product" },
  },
];

export default function HeroSection({
  slides: customSlides,
  img,
  running = true,
  intervalDuration = 5000,
  prevNextBtn = true,
  dots = true,
}) {
  // Normalize slide items (supports rich slides object or legacy img string array)
  const slides = (customSlides || DEFAULT_SLIDES).map((slide, index) => {
    if (typeof slide === "string") {
      const fallback = DEFAULT_SLIDES[index % DEFAULT_SLIDES.length];
      return { ...fallback, id: index + 1, image: slide };
    }
    if (img && img[index]) {
      return { ...slide, image: img[index] };
    }
    return slide;
  });

  const [curr, setCurr] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  const prev = useCallback(() => {
    setCurr((prevCurr) => (prevCurr === 0 ? slides.length - 1 : prevCurr - 1));
  }, [slides.length]);

  const next = useCallback(() => {
    setCurr((prevCurr) => (prevCurr < slides.length - 1 ? prevCurr + 1 : 0));
  }, [slides.length]);

  // Auto-play interval
  useEffect(() => {
    if (!running || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      next();
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [running, isPaused, next, intervalDuration, slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[curr] || slides[0];

  return (
    <section
      aria-label="Hero Carousel"
      className="relative w-full h-[80vh] min-h-[500px] sm:h-[88vh] sm:min-h-[580px] max-h-[860px] overflow-hidden bg-[#0d0b0a] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* <=================== SLIDE BACKGROUND IMAGES WITH KEN BURNS ===================> */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide.id || curr}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: "easeInOut" },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title || "Karnival Kookies Hero"}
            fill
            priority={curr === 0}
            loading={curr === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* LUXURY CINEMATIC GRADIENT VIGNETTES */}
          <div
            className="absolute inset-0 bg-linear-to-t from-[#0d0b0a] via-black/55 to-[#0d0b0a]/75"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-radial from-transparent via-black/35 to-black/85"
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      {/* <=================== AMBIENT GLOW ACCENTS ===================> */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-primary/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-16 right-16 w-64 h-64 bg-[#e6aa38]/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* <=================== CONTENT OVERLAY ===================> */}
      <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={curr}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3.5 sm:gap-6 max-w-3xl"
          >
            {/* BADGE */}
            {currentSlide.badge && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/15 border border-primary/35 text-primary text-[11px] sm:text-sm uppercase tracking-[0.14em] sm:tracking-[0.18em] font-medium backdrop-blur-md shadow-lg shadow-primary/10"
              >
                <HiSparkles className="text-primary text-xs sm:text-sm animate-pulse" />
                <span>{currentSlide.badge}</span>
              </motion.div>
            )}

            {/* MAIN HEADING */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white font-normal tracking-tight leading-[1.15] drop-shadow-lg">
                {currentSlide.title}{" "}
                <span className="block sm:inline font-serif text-transparent bg-clip-text bg-linear-to-r from-[#f5c35b] via-primary to-[#d2982c] drop-shadow-md">
                  {currentSlide.highlight}
                </span>
              </h1>
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs sm:text-base md:text-lg text-neutral-300 font-light max-w-xs sm:max-w-xl mx-auto leading-relaxed drop-shadow px-2 sm:px-0">
              {currentSlide.description}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              {currentSlide.primaryCta && (
                <Link
                  href={currentSlide.primaryCta.href || "/shop-product"}
                  className="py-2.5 px-5 sm:py-3.5 sm:px-7 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-xs sm:text-base flex items-center gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/45 hover:brightness-110 active:scale-[0.97] transition-all duration-300 cursor-pointer group"
                >
                  <span>{currentSlide.primaryCta.text}</span>
                  <FiArrowRight className="text-sm sm:text-lg group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              )}

              {currentSlide.secondaryCta && (
                <Link
                  href={currentSlide.secondaryCta.href || "/shop-product"}
                  className="py-2.5 px-4 sm:py-3.5 sm:px-6 rounded-full bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/20 hover:border-primary/50 text-xs sm:text-base font-semibold backdrop-blur-md active:scale-[0.97] transition-all duration-300 cursor-pointer"
                >
                  {currentSlide.secondaryCta.text}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* <=================== PREV / NEXT BUTTONS (DESKTOP / TABLET ONLY) ===================> */}
      {prevNextBtn && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous Slide"
            className="hidden sm:flex absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-primary/20 border border-white/15 hover:border-primary/50 text-white/80 hover:text-primary backdrop-blur-md transition-all duration-300 items-center justify-center active:scale-90 shadow-xl cursor-pointer"
          >
            <FiChevronLeft className="text-xl sm:text-2xl" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next Slide"
            className="hidden sm:flex absolute top-1/2 right-4 sm:right-6 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-primary/20 border border-white/15 hover:border-primary/50 text-white/80 hover:text-primary backdrop-blur-md transition-all duration-300 items-center justify-center active:scale-90 shadow-xl cursor-pointer"
          >
            <FiChevronRight className="text-xl sm:text-2xl" />
          </button>
        </>
      )}

      {/* <=================== BOTTOM PAGINATION & PROGRESS ===================> */}
      {dots && slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 z-20 flex items-center justify-center gap-3">
          {slides.map((slide, index) => {
            const isActive = index === curr;
            return (
              <button
                key={slide.id || index}
                type="button"
                onClick={() => setCurr(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-500 rounded-full cursor-pointer h-2 ${
                  isActive
                    ? "w-8 sm:w-10 bg-linear-to-r from-[#e6aa38] to-primary shadow-md shadow-primary/50 ring-2 ring-primary/40"
                    : "w-2 sm:w-2.5 bg-white/25 hover:bg-white/50"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

HeroSection.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      image: PropTypes.string.isRequired,
      badge: PropTypes.string,
      title: PropTypes.string,
      highlight: PropTypes.string,
      description: PropTypes.string,
      primaryCta: PropTypes.shape({
        text: PropTypes.string,
        href: PropTypes.string,
      }),
      secondaryCta: PropTypes.shape({
        text: PropTypes.string,
        href: PropTypes.string,
      }),
    })
  ),
  img: PropTypes.arrayOf(PropTypes.string),
  running: PropTypes.bool,
  intervalDuration: PropTypes.number,
  prevNextBtn: PropTypes.bool,
  dots: PropTypes.bool,
};
