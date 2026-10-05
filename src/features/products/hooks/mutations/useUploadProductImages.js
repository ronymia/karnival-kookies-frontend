"use client";

import { useUploadProductsImagesMutation } from "@/redux/apis/productApis";

/**
 * Custom mutation hook for uploading product image files.
 */
export default function useUploadProductImages() {
  const [uploadProductImages, mutationState] = useUploadProductsImagesMutation();

  return [uploadProductImages, mutationState];
}
