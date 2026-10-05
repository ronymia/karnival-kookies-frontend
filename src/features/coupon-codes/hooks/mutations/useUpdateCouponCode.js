"use client";

import { useUpdateCouponCodeMutation } from "@/redux/apis/couponCodeApi";

export default function useUpdateCouponCode() {
  return useUpdateCouponCodeMutation();
}
