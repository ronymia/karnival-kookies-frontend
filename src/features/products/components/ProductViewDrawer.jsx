"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { getDate } from "@/utils/getDate";
import { htmlToPlainText } from "@/utils/htmlToPlainText";
import { FiEdit2, FiTag, FiBox, FiDollarSign, FiCalendar } from "react-icons/fi";

export default function ProductViewDrawer({
  isOpen,
  onClose,
  product = null,
  onEdit = null,
}) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) return null;

  const images = product?.images || [];
  const activeImage = images[activeImageIdx] || images[0] || "";
  const imageUrl = getFullImageLink(activeImage, "Products");

  const price = Number(product?.price) || 0;
  const isDiscount = Number(product?.is_discount_enable) === 1;
  const netPrice = isDiscount
    ? product?.net_price
      ? Number(product.net_price)
      : price
    : price;

  const quantity = Number(product?.quantity) || 0;
  const unit = product?.unit || "pcs";
  const plainDesc = htmlToPlainText(product?.description);

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={product?.name || "Product Details"}
      description="Inspect detailed bakery catalog information and media assets."
      size="md"
    >
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="space-y-6">
          {/* IMAGE PREVIEW HERO */}
          {images.length > 0 ? (
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-lg">
                <Image
                  src={imageUrl || "/noDataFound.svg"}
                  alt={product?.name || "Product Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover"
                />
              </div>

              {/* IMAGE THUMBNAIL LIST */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => {
                    const thumbUrl = getFullImageLink(img, "Products");
                    const isSelected = idx === activeImageIdx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary shadow-md shadow-primary/20 scale-105"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={thumbUrl || "/noDataFound.svg"}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full py-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 text-xs">
              No product images uploaded
            </div>
          )}

          {/* QUICK METRICS GRID */}
          <div className="grid grid-cols-2 gap-3">
            {/* PRICING CARD */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <FiDollarSign className="text-primary text-sm" />
                <span>Price</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold font-sans tracking-tight text-primary">
                  ${netPrice.toFixed(2)}
                </span>
                {isDiscount && (
                  <span className="text-xs text-neutral-500 line-through">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>
              {isDiscount && (
                <span className="inline-block text-[10px] font-semibold text-emerald-400">
                  {product?.discount_type === "fixed"
                    ? `$${Number(product?.discount_value).toFixed(2)} discount`
                    : `${product?.discount_value}% discount`}
                </span>
              )}
            </div>

            {/* INVENTORY CARD */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <FiBox className="text-primary text-sm" />
                <span>Inventory</span>
              </div>
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
                <span className="text-base font-semibold text-white">
                  {quantity} {unit}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block">
                {quantity > 0 ? "Ready to fulfill" : "Out of stock"}
              </span>
            </div>
          </div>

          {/* CATEGORY & STATUS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <FiTag className="text-primary" /> Category
              </span>
              <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {product?.category?.name || "Uncategorized"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <FiCalendar className="text-primary" /> Created
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {getDate(product?.created_at)}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          {plainDesc && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary/90 block">
                Description
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed p-4 rounded-2xl bg-white/5 border border-white/10">
                {plainDesc}
              </p>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 mt-auto">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<FiEdit2 />}
              onClick={() => {
                onClose?.();
                onEdit(product);
              }}
            >
              Edit Product
            </Button>
          )}
        </div>
      </div>
    </SlideOverDrawer>
  );
}

ProductViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onEdit: PropTypes.func,
};
