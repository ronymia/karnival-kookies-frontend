"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";

/**
 * Custom hook to fetch all bakery categories with centralized error handling.
 */
export default function useCategories(params = {}) {
  const {
    data: categoryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllCategoriesQuery(params);

  const categories = categoryData?.data || [];

  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to load categories.";

      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text={errorMessage}
        />
      ));
    }
  }, [isError, error]);

  return {
    categories,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
