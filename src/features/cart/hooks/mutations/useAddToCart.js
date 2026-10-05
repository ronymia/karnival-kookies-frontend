"use client";

import { useAddToCartMutation } from "@/redux/apis/cartApis";

export default function useAddToCart() {
  return useAddToCartMutation();
}
