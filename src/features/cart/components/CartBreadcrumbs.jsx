"use client";

import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function CartBreadcrumbs({ current = "Cart" }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-primary/25 backdrop-blur-md text-[11px] uppercase font-semibold tracking-widest text-primary shadow-sm"
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
      >
        <FiHome className="text-xs" />
        <span>Home</span>
      </Link>

      <span className="text-primary/40">/</span>

      <Link
        href="/shop-product"
        className="text-neutral-400 hover:text-white transition-colors"
      >
        Shop
      </Link>

      <span className="text-primary/40">/</span>

      <span className="text-primary">{current}</span>
    </nav>
  );
}

CartBreadcrumbs.propTypes = {
  current: PropTypes.string,
};
