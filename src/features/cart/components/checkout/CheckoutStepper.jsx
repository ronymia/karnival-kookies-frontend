"use client";

import React from "react";
import PropTypes from "prop-types";
import { FiMapPin, FiFileText, FiCheckSquare, FiCreditCard } from "react-icons/fi";

const STEPS = [
  { step: 1, label: "Shipping Address", icon: FiMapPin },
  { step: 2, label: "Order Summary", icon: FiFileText },
  { step: 3, label: "Review Details", icon: FiCheckSquare },
  { step: 4, label: "Payment", icon: FiCreditCard },
];

export default function CheckoutStepper({ currentStep = 1 }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 py-2">
      <div className="flex items-start justify-between relative">
        {/* PROGRESS TRACK LINE ALIGNED WITH ICON CENTERS */}
        <div className="absolute top-[18px] sm:top-[22px] -translate-y-1/2 left-4 right-4 h-0.5 bg-white/10 -z-0" />
        <div
          className="absolute top-[18px] sm:top-[22px] -translate-y-1/2 left-4 h-0.5 bg-primary transition-all duration-300 -z-0"
          style={{
            width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 2rem)`,
          }}
        />

        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              className="flex flex-col items-center gap-2 relative z-10 select-none"
            >
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                  isCurrent
                    ? "bg-primary text-black ring-4 ring-primary/20 shadow-lg shadow-primary/30 scale-105"
                    : isCompleted
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "bg-[#1f1b18] border border-white/10 text-neutral-400"
                }`}
              >
                <Icon className="text-sm sm:text-base stroke-[2.2]" />
              </div>

              <span
                className={`text-[11px] sm:text-xs font-medium tracking-tight text-center ${
                  isCurrent
                    ? "text-primary font-semibold"
                    : isCompleted
                    ? "text-white font-medium"
                    : "text-neutral-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

CheckoutStepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
};
