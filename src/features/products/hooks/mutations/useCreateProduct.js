"use client";

import { useCreateProductsMutation } from "@/redux/apis/productApis";

/**
 * Custom mutation hook for creating a product.
 */
export default function useCreateProduct() {
  const [createProduct, mutationState] = useCreateProductsMutation();

  return [createProduct, mutationState];
}
