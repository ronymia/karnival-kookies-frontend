import React from "react";
import Image from "next/image";
import { getFullImageLink } from "@/utils/getFullImageLink";

// ==================== PRODUCT TABLE CONFIG ====================

export const PRODUCT_TABLE_COLUMNS = [
  {
    header: "#",
    "data-label": "#",
    accessorKey: "count",
  },
  {
    header: "Product",
    "data-label": "Product",
    accessorKey: "product_display",
  },
  {
    header: "Category",
    "data-label": "Category",
    accessorKey: "category_display",
  },
  {
    header: "Price",
    "data-label": "Price",
    accessorKey: "price_display",
  },
  {
    header: "Inventory",
    "data-label": "Inventory",
    accessorKey: "stock_display",
  },
  {
    header: "Status",
    "data-label": "Status",
    accessorKey: "status_display",
  },
];

/**
 * Formats raw product records into luxury table rows with rich cell decorators.
 */
export function formatProductRows(products = [], page = 1, limit = 10, onViewImages = null) {
  if (!Array.isArray(products)) return [];

  return products.map((product, idx) => {
    const count = (page - 1) * limit + idx + 1;
    const firstImage = product?.images?.length > 0 ? product.images[0] : null;
    const imageUrl = getFullImageLink(firstImage, "Products");

    const price = Number(product?.price) || 0;
    const isDiscount = Number(product?.is_discount_enable) === 1;
    const netPrice = isDiscount
      ? product?.net_price
        ? Number(product.net_price)
        : price
      : price;

    const quantity = Number(product?.quantity) || 0;
    const unit = product?.unit || "pcs";

    return {
      ...product,
      count,
      product_display: (
        <div className="flex items-center gap-3.5 min-w-[200px]">
          {/* IMAGE THUMBNAIL */}
          <div
            onClick={() => onViewImages?.(product?.images)}
            className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 cursor-pointer group/thumb hover:border-primary/50 transition-all shadow-sm"
            title="Click to view images"
          >
            <Image
              src={imageUrl || "/noDataFound.svg"}
              alt={product?.name || "Product"}
              fill
              sizes="48px"
              className="object-cover group-hover/thumb:scale-110 transition-transform duration-300"
            />
            {product?.images?.length > 1 && (
              <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[9px] font-bold text-primary">
                +{product.images.length - 1}
              </span>
            )}
          </div>

          {/* NAME & UNIT */}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
              {product?.name}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              Unit: <span className="text-neutral-200">{unit}</span>
            </span>
          </div>
        </div>
      ),

      category_display: (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary text-xs font-medium">
          {product?.category?.name || "Uncategorized"}
        </span>
      ),

      price_display: (
        <div className="flex flex-col">
          <span className="font-bold text-sm font-sans tracking-tight text-primary">
            ${netPrice.toFixed(2)}
          </span>
          {isDiscount && (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-neutral-500 line-through">
                ${price.toFixed(2)}
              </span>
              <span className="text-red-400 font-semibold">
                {product?.discount_type === "fixed"
                  ? `-$${Number(product?.discount_value || 0).toFixed(2)}`
                  : `-${Number(product?.discount_value || 0)}%`}
              </span>
            </div>
          )}
        </div>
      ),

      stock_display: (
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              quantity > 10
                ? "bg-emerald-400"
                : quantity > 0
                ? "bg-amber-400 animate-pulse"
                : "bg-red-500"
            }`}
          />
          <span className="text-xs font-medium text-neutral-200">
            {quantity} {unit}
          </span>
        </div>
      ),

      status_display: (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${
            product?.status === "inactive"
              ? "bg-neutral-800/40 border-neutral-700 text-neutral-400"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product?.status === "inactive" ? "bg-neutral-500" : "bg-emerald-400 animate-pulse"
            }`}
          />
          {product?.status === "inactive" ? "Inactive" : "Active"}
        </span>
      ),
    };
  });
}
