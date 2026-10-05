"use client";

import { useCartCheckoutMutation } from "@/redux/apis/cartApis";

export default function useCartCheckout() {
  return useCartCheckoutMutation();
}
