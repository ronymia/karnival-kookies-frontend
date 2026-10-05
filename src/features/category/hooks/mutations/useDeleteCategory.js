"use client";

import { useDeleteCategoryMutation } from "@/redux/apis/categoryApis";

/**
 * Custom mutation hook for deleting a category.
 */
export default function useDeleteCategory() {
  const [deleteCategory, mutationState] = useDeleteCategoryMutation();

  return [deleteCategory, mutationState];
}
