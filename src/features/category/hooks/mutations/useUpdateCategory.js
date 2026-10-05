"use client";

import { useUpdateCategoryMutation } from "@/redux/apis/categoryApis";

/**
 * Custom mutation hook for updating an existing category.
 */
export default function useUpdateCategory() {
  const [updateCategory, mutationState] = useUpdateCategoryMutation();

  return [updateCategory, mutationState];
}
