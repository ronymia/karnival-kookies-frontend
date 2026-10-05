"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiCheckCircle,
  FiShoppingBag,
  FiPackage,
  FiArrowRight,
  FiTruck,
  FiMail,
} from "react-icons/fi";
import { Button } from "@/components/ui/buttons";

export default function OrderSuccessScreen() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const orderNumber = searchParams.get("order_number") || (orderId ? `KK-${orderId}` : "");

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 pt-28 sm:pt-36 pb-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8 text-center">
        {/* CELEBRATION ICON */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 text-4xl sm:text-5xl shadow-2xl shadow-emerald-500/20 animate-bounce">
            <FiCheckCircle />
          </div>
          <div className="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full -z-10" />
        </div>

        {/* HEADLINE */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Order Confirmed & Paid
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Baked with Love, on Its Way!
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Thank you for ordering with Karnival Kookies. Your batch is queued for baking, cold-packing, and expedited dispatch.
          </p>
        </div>

        {/* ORDER SUMMARY PILL */}
        {orderNumber && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm">
            <FiPackage className="text-primary text-base" />
            <span className="text-neutral-400">Order Reference:</span>
            <span className="font-mono font-bold text-white tracking-wider">
              {orderNumber}
            </span>
          </div>
        )}

        {/* NEXT STEPS CARD */}
        <div className="rounded-3xl bg-[#14110f] border border-white/10 p-6 sm:p-8 text-left space-y-4 shadow-xl">
          <h3 className="font-serif text-lg font-medium text-white border-b border-white/10 pb-3">
            What Happens Next?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm">
                <FiMail />
              </div>
              <h4 className="text-xs font-semibold text-white">Email Receipt</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                A confirmation with your order breakdown has been emailed to you.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                <FiPackage />
              </div>
              <h4 className="text-xs font-semibold text-white">Fresh Baking</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Cookies are freshly baked in small batches before being cold-packed.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                <FiTruck />
              </div>
              <h4 className="text-xs font-semibold text-white">Expedited Dispatch</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Tracking details will update once your package leaves the bakery.
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/dashboard/order-history" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              text="View in Order History"
              endIcon={FiArrowRight}
              className="w-full sm:w-auto shadow-lg shadow-primary/20 px-8"
            />
          </Link>

          <Link href="/shop-product" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              text="Continue Shopping"
              startIcon={FiShoppingBag}
              className="w-full sm:w-auto"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
