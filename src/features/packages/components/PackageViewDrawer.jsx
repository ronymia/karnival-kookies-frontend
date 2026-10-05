"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { SlideOverDrawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/buttons";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { getDate } from "@/utils/getDate";
import { PackageService } from "../services";
import {
  FiPackage,
  FiDollarSign,
  FiArchive,
  FiClock,
  FiPercent,
  FiCheckCircle,
} from "react-icons/fi";

export default function PackageViewDrawer({ isOpen, onClose, data }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!data) return null;

  const images = Array.isArray(data.images) ? data.images : [];
  const isDiscount = Number(data.is_discount_enable) === 1;
  const basePrice = Number(data.price) || 0;
  const netPrice = PackageService.calculateNetPrice(data);

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Combo Package Details"
      description="Inspect gourmet combo specifications, contents, and inventory stats."
      size="lg"
    >
      <div className="flex flex-col h-full justify-between gap-6 pb-6">
        <div className="space-y-6">
          {/* MEDIA GALLERY */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg">
                <Image
                  src={getFullImageLink(
                    typeof images[activeImageIndex] === "object"
                      ? images[activeImageIndex]?.file
                      : images[activeImageIndex],
                    "Products"
                  )}
                  alt={data.name || "Package"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => {
                    const imgUrl = typeof img === "object" ? img?.file : img;
                    const isSelected = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary ring-2 ring-primary/40 scale-105"
                            : "border-white/15 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={getFullImageLink(imgUrl, "Products")}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* PACKAGE TITLE & STATUS */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Combo Package
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white mt-0.5">
                {data.name}
              </h2>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${
                (data.status || "active") === "active"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400"
              }`}
            >
              {(data.status || "active") === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          {/* KEY METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* PRICING */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                <FiDollarSign className="text-primary text-sm" />
                <span>Net Price</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white tracking-tight">
                  ${netPrice.toFixed(2)}
                </span>
                {isDiscount && (
                  <span className="text-xs text-neutral-500 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* STOCK & UNIT */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                <FiArchive className="text-primary text-sm" />
                <span>Inventory</span>
              </div>
              <span className="text-lg font-bold text-white">
                {data.quantity} <span className="text-xs font-normal text-neutral-400">{data.unit || "pcs"}</span>
              </span>
            </div>

            {/* DISCOUNT STATUS */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                <FiPercent className="text-primary text-sm" />
                <span>Discount</span>
              </div>
              {isDiscount ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  {data.discount_type === "percent"
                    ? `${data.discount_value}% OFF`
                    : `-$${Number(data.discount_value || 0).toFixed(2)}`}
                </span>
              ) : (
                <span className="text-sm font-medium text-neutral-400">None</span>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          {data.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Package Description
              </h4>
              <div
                className="text-sm text-neutral-300 leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-4 ql-snow"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          )}

          {/* TIMESTAMPS */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-400 border-t border-white/10">
            <div>
              <span className="block text-[10px] uppercase text-neutral-500 font-semibold">
                Created Date
              </span>
              <span className="text-neutral-300">{getDate(data.created_at)}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-neutral-500 font-semibold">
                Last Modified
              </span>
              <span className="text-neutral-300">{getDate(data.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <Button variant="primary" size="md" onClick={onClose} className="min-w-[120px]">
            Close
          </Button>
        </div>
      </div>
    </SlideOverDrawer>
  );
}

PackageViewDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
};
