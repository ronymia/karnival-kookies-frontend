"use client";

import React from "react";
import Link from "next/link";
import { FiHome, FiChevronRight, FiShoppingBag } from "react-icons/fi";

export default function OrderBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs text-neutral-400 font-medium select-none"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-primary transition-colors"
      >
        <FiHome className="text-sm" />
        <span>Home</span>
      </Link>

      <FiChevronRight className="text-neutral-600 text-xs" />

      <span className="hover:text-primary transition-colors">Admin Panel</span>

      <FiChevronRight className="text-neutral-600 text-xs" />

      <span className="flex items-center gap-1 text-primary font-semibold">
        <FiShoppingBag className="text-xs" />
        <span>Orders & Fulfillment</span>
      </span>
    </nav>
  );
}
