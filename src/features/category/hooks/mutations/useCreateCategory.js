"use client";

import { useCreateCategoryMutation } from "@/redux/apis/categoryApis";

/**
 * Custom mutation hook for creating a new category.
 */
export default function useCreateCategory() {
  const [createCategory, mutationState] = useCreateCategoryMutation();

  return [createCategory, mutationState];
}
