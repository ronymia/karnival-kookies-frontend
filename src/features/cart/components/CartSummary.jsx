"use client";

import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { Button } from "@/components/ui/buttons";
import { CartService, DEFAULT_DELIVERY_CHARGE } from "../services";
import CouponApplyInput from "./CouponApplyInput";
import { FiShield, FiLock, FiArrowRight } from "react-icons/fi";

export default function CartSummary({
  totalQuantity = 0,
  totalPrice = 0,
  selectedCount = 0,
  totalItemsCount = 0,
}) {
  const router = useRouter();
  const { appliedCoupon, activeCampaign, campaignDiscount, freeItems } = useSelector(
    (state) => state.cart || {}
  );

  const handleProceed = () => {
    if (totalQuantity > 0) {
      router.push("/cart/checkout");
    } else {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Please select at least one item from your cart to proceed."
        />
      ));
    }
  };

  const hasSelection = totalQuantity > 0;
  const currentSubtotal = totalPrice || 0;
  const discountAmount = CartService.calculateDiscount(
    currentSubtotal,
    appliedCoupon
  );
  const effectiveDiscount = Math.max(discountAmount, campaignDiscount || 0);
  const finalTotal = Math.max(0, currentSubtotal - effectiveDiscount);

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#14110f] border border-white/10 shadow-xl space-y-6">
      {/* CARD HEADER */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
          Order Summary
        </h3>
        <p className="text-xs text-neutral-400 mt-1">
          {selectedCount} of {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
        </p>
      </div>

      {/* PROMO / COUPON CODE SECTION */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-neutral-300 block">
          Have a Promo Code?
        </span>
        <CouponApplyInput subtotal={currentSubtotal} />
      </div>

      {/* FINANCIAL BREAKDOWN */}
      <div className="space-y-3 text-sm pt-2 border-t border-white/10">
        <div className="flex justify-between items-center text-neutral-300">
          <span>Selected Quantity</span>
          <span className="font-mono font-medium text-white">
            {totalQuantity} {totalQuantity === 1 ? "unit" : "units"}
          </span>
        </div>

        <div className="flex justify-between items-center text-neutral-300">
          <span>Items Subtotal</span>
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

      {/* CHECKOUT BUTTON WITH INLINE END-ICON */}
      <Button
        variant="primary"
        size="lg"
        disabled={!hasSelection}
        onClick={handleProceed}
        text="Proceed to Checkout"
        endIcon={FiArrowRight}
        className="w-full shadow-lg shadow-primary/20 py-3.5"
      />

      {/* TRUST BADGES */}
      <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] text-neutral-400 leading-snug">
        <div className="flex items-center gap-2">
          <FiLock className="text-primary text-xs shrink-0" />
          <span>Secure checkout via Stripe with 256-bit encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <FiShield className="text-primary text-xs shrink-0" />
          <span>Baked fresh daily & packaged in airtight protective crates</span>
        </div>
      </div>
    </div>
  );
}

CartSummary.propTypes = {
  totalQuantity: PropTypes.number,
  totalPrice: PropTypes.number,
  selectedCount: PropTypes.number,
  totalItemsCount: PropTypes.number,
};
