"use client";

import React, { Suspense } from "react";
import { OrderSuccessScreen } from "@/features/orders";
import CustomLoading from "@/components/ui/loader/CustomLoading";

export default function OrderSuccessAliasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0b0a] flex items-center justify-center">
          <CustomLoading />
        </div>
      }
    >
      <OrderSuccessScreen />
    </Suspense>
  );
}
