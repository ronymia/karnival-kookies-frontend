"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";

export default function CartEmptyState() {
  return (
    <div className="py-20 px-4 text-center max-w-md mx-auto space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xl">
        <FiShoppingBag className="text-3xl" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Looks like you haven&apos;t added any artisanal cookies or gourmet brownies yet.
          Explore our handcrafted daily bakery collection!
        </p>
      </div>

      <div>
        <Link href="/shop-product">
          <Button
            variant="primary"
            size="lg"
            className="inline-flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span>Explore Bakery Menu</span>
            <FiArrowRight className="text-base" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
