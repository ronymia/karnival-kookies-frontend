"use client";

import { useDeleteCouponCodeMutation } from "@/redux/apis/couponCodeApi";

export default function useDeleteCouponCode() {
  return useDeleteCouponCodeMutation();
}
