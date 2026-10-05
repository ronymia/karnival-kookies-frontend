"use client";

import { useDeleteProductsMutation } from "@/redux/apis/productApis";

/**
 * Custom mutation hook for deleting a product.
 */
export default function useDeleteProduct() {
  const [deleteProduct, mutationState] = useDeleteProductsMutation();

  return [deleteProduct, mutationState];
}
