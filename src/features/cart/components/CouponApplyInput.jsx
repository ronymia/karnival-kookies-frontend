"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { useGetCouponCodesQuery } from "@/redux/apis/couponCodeApi";
import { sampleCoupons } from "@/features/coupon-codes/data";
import { applyCoupon, removeCoupon } from "@/redux/features/cartSlice";
import { CartService } from "../services";
import { FiTag, FiX, FiCheck, FiArrowRight } from "react-icons/fi";

export default function CouponApplyInput({ subtotal = 0, compact = false }) {
  const dispatch = useDispatch();
  const { appliedCoupon } = useSelector((state) => state.cart || {});

  const [inputCode, setInputCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Fetch active coupons from server
  const { data: couponsData } = useGetCouponCodesQuery({
    status: "active",
    limit: 100,
  });

  // Combine server coupons with sample catalog so demo/seed codes always function
  const serverCoupons = Array.isArray(couponsData?.data)
    ? couponsData.data
    : [];
  const allCouponsMap = new Map();
  sampleCoupons.forEach((c) => allCouponsMap.set(c.code.toUpperCase(), c));
  serverCoupons.forEach((c) => allCouponsMap.set(c.code.toUpperCase(), c));
  const availableCoupons = Array.from(allCouponsMap.values());

  const handleApply = (e) => {
    if (e) e.preventDefault();

    if (!inputCode.trim()) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Please enter a promo or coupon code"
        />
      ));
      return;
    }

    setIsApplying(true);

    const validation = CartService.validateCoupon(
      inputCode,
      availableCoupons,
      subtotal
    );

    setIsApplying(false);

    if (!validation.valid) {
      toast.custom((t) => (
        <CustomToaster t={t} type="error" text={validation.message} />
      ));
      return;
    }

    dispatch(applyCoupon(validation.coupon));
    setInputCode("");

    const discountAmount = validation.discountAmount;
    toast.custom((t) => (
      <CustomToaster
        t={t}
        type="success"
        text={`Coupon applied! You saved $${discountAmount.toFixed(2)}`}
      />
    ));
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    toast.custom((t) => (
      <CustomToaster t={t} type="success" text="Coupon code removed" />
    ));
  };

  const currentDiscount = CartService.calculateDiscount(
    subtotal,
    appliedCoupon
  );

  return (
    <div className="w-full space-y-2">
      {appliedCoupon ? (
        /* APPLIED COUPON BADGE */
        <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <FiTag className="text-xs" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs sm:text-sm text-primary tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  {appliedCoupon.discount_type === "percent"
                    ? `${appliedCoupon.discount_value}% OFF`
                    : `-$${Number(appliedCoupon.discount_value).toFixed(2)}`}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 truncate">
                Saved ${currentDiscount.toFixed(2)} on this order
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer shrink-0"
            title="Remove coupon"
            aria-label="Remove coupon"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      ) : (
        /* INPUT PROMO FORM */
        <form onSubmit={handleApply} className="flex items-center gap-2">
          <div className="relative flex-1">
            <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Promo / Coupon Code"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-primary transition-colors uppercase tracking-wider font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={!inputCode.trim() || isApplying}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-primary hover:text-black text-white font-semibold text-xs transition-all border border-white/10 hover:border-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isApplying ? "Applying..." : "Apply"}
          </button>
        </form>
      )}
    </div>
  );
}

CouponApplyInput.propTypes = {
  subtotal: PropTypes.number,
  compact: PropTypes.bool,
};
