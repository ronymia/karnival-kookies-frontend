"use client";

import { useUpdateProductsMutation } from "@/redux/apis/productApis";

/**
 * Custom mutation hook for updating a product.
 */
export default function useUpdateProduct() {
  const [updateProduct, mutationState] = useUpdateProductsMutation();

  return [updateProduct, mutationState];
}
