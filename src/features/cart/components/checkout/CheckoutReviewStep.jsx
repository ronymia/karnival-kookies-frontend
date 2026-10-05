"use client";

import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/buttons";
import { CartService, DEFAULT_DELIVERY_CHARGE } from "../../services";
import {
  FiCheckCircle,
  FiArrowLeft,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiMail,
  FiFileText,
  FiTag,
} from "react-icons/fi";

export default function CheckoutReviewStep({
  shippingInfo,
  totalPrice = 0,
  itemCount = 0,
  onNext,
  onPrev,
}) {
  const { appliedCoupon } = useSelector((state) => state.cart || {});

  const currentSubtotal = totalPrice || 0;
  const discountAmount = CartService.calculateDiscount(
    currentSubtotal,
    appliedCoupon
  );
  const finalTotal = CartService.calculateFinalTotal(
    currentSubtotal,
    appliedCoupon,
    DEFAULT_DELIVERY_CHARGE
  );

  const fullAddress = [
    shippingInfo.address,
    shippingInfo.apartment,
    shippingInfo.city,
    shippingInfo.state,
    shippingInfo.postal_code,
    shippingInfo.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <FiCheckCircle className="text-lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Review Order Information
          </h2>
          <p className="text-xs text-neutral-400">
            Please verify your delivery address before proceeding to payment
          </p>
        </div>
      </div>

      {/* RECIPIENT & ADDRESS CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-white/10 pb-3">
          Delivery Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-neutral-500 block">Recipient Name</span>
            <span className="font-medium text-white">
              {shippingInfo.recipient_name || "N/A"}
            </span>
          </div>

          <div>
            <span className="text-xs text-neutral-500 block">Contact Phone</span>
            <div className="flex items-center gap-1.5 text-neutral-200 mt-0.5">
              <FiPhone className="text-primary text-xs" />
              <span>{shippingInfo.phone || "N/A"}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs text-neutral-500 block">Notification Email</span>
            <div className="flex items-center gap-1.5 text-neutral-200 mt-0.5">
              <FiMail className="text-primary text-xs" />
              <span>{shippingInfo.email || "N/A"}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="text-xs text-neutral-500 block">Shipping Address</span>
            <div className="flex items-start gap-1.5 text-neutral-200 mt-0.5">
              <FiMapPin className="text-primary text-xs shrink-0 mt-1" />
              <span>{fullAddress || "No address provided"}</span>
            </div>
          </div>

          {shippingInfo.delivery_instruction && (
            <div className="sm:col-span-2 p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5 mb-1">
                <FiFileText className="text-primary" />
                Delivery Instructions:
              </span>
              <p className="text-xs text-neutral-200 italic">
                &ldquo;{shippingInfo.delivery_instruction}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PROMO / COUPON APPLIED INFO */}
      {appliedCoupon && discountAmount > 0 && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FiTag className="text-primary text-sm" />
            <span className="text-white">
              Applied Promo:{" "}
              <strong className="font-mono text-primary">
                {appliedCoupon.code}
              </strong>
            </span>
          </div>
          <span className="font-mono text-emerald-400 font-semibold">
            -${discountAmount.toFixed(2)} Saved
          </span>
        </div>
      )}

      {/* FINAL PAYABLE CARD */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-neutral-400 block">
            Items to dispatch ({itemCount} {itemCount === 1 ? "unit" : "units"}) &bull; Delivery: $0.00
          </span>
          <span className="text-sm font-semibold text-white">Final Payable Amount</span>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-primary">
            ${finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex items-center justify-between pt-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          text="Back to Summary"
          startIcon={FiArrowLeft}
        />

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNext}
          text="Proceed to Payment"
          endIcon={FiCreditCard}
          className="shadow-lg shadow-primary/20 px-8"
        />
      </div>
    </div>
  );
}

CheckoutReviewStep.propTypes = {
  shippingInfo: PropTypes.object.isRequired,
  totalPrice: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};
