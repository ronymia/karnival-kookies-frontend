"use client";

import React from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addItems, removeItems } from "@/redux/features/cartSlice";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import {
  CartBreadcrumbs,
  CartItemCard,
  CartSummary,
  CartEmptyState,
} from "../components";
import useAuth from "@/hooks/useAuth";
import { useGetCart, useCartEvaluation } from "../hooks";
import { FiCheckSquare, FiSquare } from "react-icons/fi";

export default function CartScreen() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { totalQuantity, totalPrice, selectedItems, appliedCoupon } = useSelector(
    (state) => state.cart
  );

  const { cartItems, isLoading } = useGetCart();

  // Real-time debounced cart evaluation (300ms) against campaigns/coupons
  useCartEvaluation({
    cartItems: selectedItems?.length > 0 ? selectedItems : cartItems,
    couponCode: appliedCoupon?.code,
    userId: user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-[#0d0b0a]">
        <CustomLoading />
      </div>
    );
  }

  const hasItems = Array.isArray(cartItems) && cartItems.length > 0;
  const allSelected =
    hasItems &&
    cartItems.every((item) =>
      selectedItems?.some((sel) => sel?.id === item?.id)
    );

  const handleToggleSelectAll = () => {
    if (allSelected) {
      cartItems.forEach((item) => {
        dispatch(removeItems(item));
      });
    } else {
      cartItems.forEach((item) => {
        const isAlreadySelected = selectedItems?.some(
          (sel) => sel?.id === item?.id
        );
        if (!isAlreadySelected) {
          dispatch(addItems(item));
        }
      });
    }
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
          <CartBreadcrumbs current="Cart" />

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Your Shopping Bag
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Review your gourmet treats, customize quantities, and proceed to checkout.
          </p>
        </div>
      </section>

      {/* ===================== MAIN CART CONTENT ===================== */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {hasItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CART ITEMS COLUMN (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              {/* TOP HEADER MATCHING ORDER SUMMARY */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#14110f] border border-white/10 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                      Bag Items
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {cartItems.length} {cartItems.length === 1 ? "treat" : "treats"} currently in bag
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-primary/25 text-primary hover:bg-primary/10 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    {allSelected ? (
                      <>
                        <FiCheckSquare className="text-sm" />
                        <span>Deselect All</span>
                      </>
                    ) : (
                      <>
                        <FiSquare className="text-sm" />
                        <span>Select All</span>
                      </>
                    )}
                  </button>
                </div>

                {/* ITEMS LIST */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItemCard key={item?.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* STICKY ORDER SUMMARY COLUMN (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24">
              <CartSummary
                totalQuantity={totalQuantity || 0}
                totalPrice={totalPrice || 0}
                selectedCount={selectedItems?.length || 0}
                totalItemsCount={cartItems.length}
              />
            </div>
          </div>
        ) : (
          <CartEmptyState />
        )}
      </main>
    </div>
  );
}
