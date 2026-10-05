"use client";

import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useSelector } from "react-redux";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { Button } from "@/components/ui/buttons";
import { CartService, DEFAULT_DELIVERY_CHARGE } from "../../services";
import CouponApplyInput from "../CouponApplyInput";
import { FiArrowRight, FiArrowLeft, FiPackage } from "react-icons/fi";

export default function CheckoutSummaryStep({
  selectedItems = [],
  totalPrice = 0,
  onNext,
  onPrev,
}) {
  const { appliedCoupon, activeCampaign, campaignDiscount, freeItems } = useSelector(
    (state) => state.cart || {}
  );

  const currentSubtotal = totalPrice || 0;
  const discountAmount = CartService.calculateDiscount(
    currentSubtotal,
    appliedCoupon
  );
  const effectiveDiscount = Math.max(discountAmount, campaignDiscount || 0);
  const finalTotal = Math.max(0, currentSubtotal - effectiveDiscount);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <FiPackage className="text-lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Order Items & Summary
          </h2>
          <p className="text-xs text-neutral-400">
            Review the items included in this bakery order
          </p>
        </div>
      </div>

      {/* LINE ITEMS */}
      <div className="space-y-3">
        {selectedItems.map((cartItem) => {
          const product = cartItem?.product || {};
          const images = product.images || [];
          const imgUrl = images[0] || "/images/cookie-placeholder.jpg";
          const unitPrice = CartService.getItemUnitPrice(cartItem);
          const qty = cartItem?.quantity || 1;
          const lineTotal = unitPrice * qty;
          const itemKey =
            cartItem?.id || cartItem?.product_id || cartItem?.product?.id;

          return (
            <div
              key={itemKey}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/40 border border-white/10 shrink-0">
                  <Image
                    src={getFullImageLink(imgUrl)}
                    alt={product.name || "Product"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-sm text-white truncate">
                    {product.name || "Artisanal Treat"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <span className="font-mono">${unitPrice.toFixed(2)}</span>
                    <span>&times;</span>
                    <span className="font-mono text-white font-medium">{qty}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-white text-base">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* PROMO / COUPON CODE */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
        <span className="text-xs font-medium text-neutral-300 block">
          Apply Promo / Coupon Code
        </span>
        <CouponApplyInput subtotal={currentSubtotal} />
      </div>

      {/* TOTALS SUMMARY */}
      <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 text-sm">
        <div className="flex justify-between items-center text-neutral-300">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-white">
            ${currentSubtotal.toFixed(2)}
          </span>
        </div>

        {effectiveDiscount > 0 && (
          <div className="flex justify-between items-center text-primary">
            <span>Promotion ({activeCampaign?.title || appliedCoupon?.code || "Discount"})</span>
            <span className="font-mono font-semibold">
              -${effectiveDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {freeItems && freeItems.length > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-transparent border border-primary/30 flex items-center justify-between gap-2 text-xs">
            <span className="text-amber-300 font-medium truncate">
              🎉 You earned {freeItems[0].quantity}x Free {freeItems[0].name || "Artisanal Treat"}!
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] shrink-0">
              FREE ($0.00)
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-neutral-300">
          <span>Delivery Charge</span>
          <span className="font-mono text-emerald-400 font-medium">$0.00 (Free)</span>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-base font-semibold text-white">Total Amount</span>
          <span className="font-mono text-2xl font-bold text-primary">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* STEP NAVIGATION */}
      <div className="flex items-center justify-between pt-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          text="Back to Shipping"
          startIcon={FiArrowLeft}
        />

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNext}
          text="Review Final Details"
          endIcon={FiArrowRight}
          className="shadow-lg shadow-primary/20 px-8"
        />
      </div>
    </div>
  );
}

CheckoutSummaryStep.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  totalPrice: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};
