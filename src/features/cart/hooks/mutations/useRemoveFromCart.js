"use client";

import { useRemoveFromCartMutation } from "@/redux/apis/cartApis";

export default function useRemoveFromCart() {
  return useRemoveFromCartMutation();
}
