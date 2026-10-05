"use client";

import { useUpdateQuantityOfCartProductMutation } from "@/redux/apis/cartApis";

export default function useUpdateCartQuantity() {
  return useUpdateQuantityOfCartProductMutation();
}
