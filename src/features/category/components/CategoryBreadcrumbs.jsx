"use client";

import Link from "next/link";
import { FiChevronRight, FiHome, FiFolder } from "react-icons/fi";

export default function CategoryBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-xs font-medium text-neutral-400"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-white transition-colors"
      >
        <FiHome className="text-xs text-primary" />
        <span>Home</span>
      </Link>

      <FiChevronRight className="text-neutral-600 text-xs" />

      <Link
        href="/admin/all-products"
        className="hover:text-white transition-colors"
      >
        Admin Panel
      </Link>

      <FiChevronRight className="text-neutral-600 text-xs" />

      <span className="flex items-center gap-1.5 text-primary font-semibold">
        <FiFolder className="text-xs" />
        <span>Categories</span>
      </span>
    </nav>
  );
}
