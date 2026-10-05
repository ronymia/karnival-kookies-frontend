import React from "react";
import Image from "next/image";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { PackageService } from "./packageService";

export const PACKAGE_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "PACKAGE",
    accessorKey: "package_info",
    minWidth: 25,
    show: true,
    isMainField: true,
  },
  {
    header: "BASE PRICE",
    accessorKey: "base_price",
    minWidth: 12,
    show: true,
  },
  {
    header: "DISCOUNT",
    accessorKey: "discount_badge",
    minWidth: 12,
    show: true,
  },
  {
    header: "NET PRICE",
    accessorKey: "net_price_display",
    minWidth: 12,
    show: true,
  },
  {
    header: "STOCK",
    accessorKey: "stock_badge",
    minWidth: 12,
    show: true,
  },
  {
    header: "STATUS",
    accessorKey: "status_badge",
    minWidth: 10,
    show: true,
  },
];

/**
 * Formats raw package data into rich table rows.
 */
export function formatPackageRows(
  packages = [],
  currentPage = 1,
  pageSize = 10,
  onImageClick
) {
  if (!Array.isArray(packages)) return [];

  return packages.map((pkg, idx) => {
    const isDiscount = Number(pkg.is_discount_enable) === 1;
    const basePrice = Number(pkg.price) || 0;
    const netPrice = PackageService.calculateNetPrice(pkg);
    const stock = Number(pkg.quantity) || 0;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;
    const isActive = (pkg.status || "active") === "active";

    const firstImage =
      Array.isArray(pkg.images) && pkg.images.length > 0
        ? typeof pkg.images[0] === "object"
          ? pkg.images[0]?.file
          : pkg.images[0]
        : "";

    return {
      ...pkg,
      count: (currentPage - 1) * pageSize + idx + 1,

      // PACKAGE INFO (IMAGE + NAME + UNIT)
      package_info: (
        <div className="flex items-center gap-3 py-1">
          <div
            onClick={() => onImageClick?.(pkg.images)}
            className="relative w-12 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shrink-0 cursor-pointer group shadow-sm hover:border-primary/50 transition-all"
            title="Click to view image gallery"
          >
            <Image
              src={getFullImageLink(firstImage, "Products")}
              alt={pkg.name || "Package image"}
              fill
              sizes="48px"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-white truncate text-sm hover:text-primary transition-colors">
              {pkg.name}
            </span>
            <span className="text-[11px] text-neutral-400">
              Unit: <strong className="text-neutral-300">{pkg.unit || "pcs"}</strong>
            </span>
          </div>
        </div>
      ),

      // BASE PRICE
      base_price: (
        <span className="font-sans font-medium text-neutral-300 text-sm">
          ${basePrice.toFixed(2)}
        </span>
      ),

      // DISCOUNT BADGE
      discount_badge: isDiscount ? (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          {pkg.discount_type === "percent"
            ? `${pkg.discount_value}% OFF`
            : `-$${Number(pkg.discount_value || 0).toFixed(2)}`}
        </span>
      ) : (
        <span className="text-xs text-neutral-500 font-medium">—</span>
      ),

      // NET PRICE
      net_price_display: (
        <span className="font-sans font-bold text-primary text-sm tracking-tight">
          ${netPrice.toFixed(2)}
        </span>
      ),

      // STOCK BADGE
      stock_badge: (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOutOfStock
                ? "bg-rose-500 shadow-sm shadow-rose-500/50"
                : isLowStock
                ? "bg-amber-400 shadow-sm shadow-amber-400/50"
                : "bg-emerald-400 shadow-sm shadow-emerald-400/50"
            }`}
          />
          <span
            className={`font-semibold ${
              isOutOfStock
                ? "text-rose-400"
                : isLowStock
                ? "text-amber-300"
                : "text-neutral-200"
            }`}
          >
            {stock} {pkg.unit || "pcs"}
          </span>
        </div>
      ),

      // STATUS BADGE
      status_badge: (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            isActive
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-neutral-800 border-neutral-700 text-neutral-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    };
  });
}
