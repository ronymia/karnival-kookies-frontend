"use client";

import React from "react";
import Link from "next/link";
import { FiHome, FiChevronRight } from "react-icons/fi";

export default function ProductBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumbs"
      className="flex items-center gap-2 text-xs text-neutral-400 font-medium"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-primary transition-colors"
      >
        <FiHome className="text-sm" />
        <span>Home</span>
      </Link>
      <FiChevronRight className="text-neutral-600 text-xs" />
      <Link
        href="/admin"
        className="hover:text-primary transition-colors"
      >
        Admin Panel
      </Link>
      <FiChevronRight className="text-neutral-600 text-xs" />
      <span className="text-primary font-semibold">Products</span>
    </nav>
  );
}
