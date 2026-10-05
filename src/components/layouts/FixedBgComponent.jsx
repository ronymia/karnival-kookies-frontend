"use client";

import { useRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

export default function FixedBgComponent({
  component,
  imagePath = "/chocolate.jpg",
  wrapperClass = "py-24 sm:py-32 md:py-40",
  overlayClass = "bg-linear-to-b from-black/80 via-black/55 to-black/85",
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth framer-motion parallax scroll effect
  const y = useTransform(scrollYProgress, [0, 1], ["-16%", "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.04]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex items-center justify-center min-h-[300px] sm:min-h-[360px]"
    >
      {/* PARALLAX BACKGROUND IMAGE */}
      <motion.div
        style={{ y, scale }}
        className="absolute -inset-y-16 -inset-x-4 z-0 will-change-transform"
      >
        <Image
          src={imagePath}
          alt="Atmospheric Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* LUXURY AMBIENT OVERLAY & VIGNETTE */}
      <div
        className={`absolute inset-0 z-10 backdrop-blur-[1px] pointer-events-none ${overlayClass}`}
      />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />

      {/* CONTENT */}
      <div
        className={`relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-center ${wrapperClass}`}
      >
        {component}
      </div>
    </div>
  );
}

// PROPS TYPE DEFINE
FixedBgComponent.propTypes = {
  component: PropTypes.node.isRequired,
  imagePath: PropTypes.string,
  wrapperClass: PropTypes.string,
  overlayClass: PropTypes.string,
};
