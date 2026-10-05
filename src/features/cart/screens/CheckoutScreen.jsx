"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  CartBreadcrumbs,
  CheckoutStepper,
  CheckoutShippingStep,
  CheckoutSummaryStep,
  CheckoutReviewStep,
  CheckoutPaymentStep,
} from "../components";
import { useCheckoutState } from "../hooks";

export default function CheckoutScreen() {
  const { selectedItems, totalPrice } = useSelector((state) => state.cart);
  const {
    formData,
    currentStep,
    nextStep,
    prevStep,
    updateAllShippingInfo,
  } = useCheckoutState();

  const handleSaveShipping = (shippingData) => {
    updateAllShippingInfo(shippingData);
    nextStep();
  };

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 pb-28">
      {/* ===================== COMPACT LUXURY HEADER ===================== */}
      <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-12 text-center overflow-hidden border-b border-white/5">
        {/* ATMOSPHERIC BACKGROUND WITH SOFT GRADIENT */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/chocolate_bg.jpg"
            alt="Artisanal Bakery Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b0a]/75 via-[#0d0b0a]/85 to-[#0d0b0a]" />
        </div>

        {/* HEADER CONTENT */}
        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-3">
          <CartBreadcrumbs current="Checkout" />

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Artisanal Checkout
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Follow the steps below to confirm your delivery address and finalize your order.
          </p>
        </div>
      </section>

      {/* ===================== MAIN CHECKOUT BODY ===================== */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 sm:pt-10">
        {/* SINGLE UNIFIED MASTER CARD */}
        <div className="rounded-2xl bg-[#14110f] border border-white/10 shadow-2xl overflow-hidden">
          {/* STEPPER HEADER SECTION */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-black/25">
            <CheckoutStepper currentStep={currentStep} />
          </div>

          {/* STEP CONTENT SECTION */}
          <div className="p-5 sm:p-8">
            {currentStep === 1 && (
              <CheckoutShippingStep
                shippingInfo={formData.shipping_info}
                onSaveShipping={handleSaveShipping}
              />
            )}

            {currentStep === 2 && (
              <CheckoutSummaryStep
                selectedItems={selectedItems || []}
                totalPrice={totalPrice || 0}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 3 && (
              <CheckoutReviewStep
                shippingInfo={formData.shipping_info}
                totalPrice={totalPrice || 0}
                itemCount={selectedItems?.length || 0}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}

            {currentStep === 4 && (
              <CheckoutPaymentStep
                shippingInfo={formData.shipping_info}
                onPrev={prevStep}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
