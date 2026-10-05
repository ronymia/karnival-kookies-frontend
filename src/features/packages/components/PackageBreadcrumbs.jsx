"use client";

import React from "react";
import Link from "next/link";
import { FiHome, FiChevronRight, FiPackage } from "react-icons/fi";

export default function PackageBreadcrumbs() {
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
        <FiPackage className="text-xs" />
        <span>Combo Packages</span>
      </span>
    </nav>
  );
}
