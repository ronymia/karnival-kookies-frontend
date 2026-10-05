"use client";

import { useCreateCouponCodeMutation } from "@/redux/apis/couponCodeApi";

export default function useCreateCouponCode() {
  return useCreateCouponCodeMutation();
}
