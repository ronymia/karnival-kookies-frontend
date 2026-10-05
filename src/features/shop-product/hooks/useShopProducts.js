"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { useGetAllProductsQuery } from "@/redux/apis/productApis";

/**
 * Custom hook to isolate product queries, format responses,
 * and centralize error handling for shop products.
 */
export default function useShopProducts(filters) {
  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllProductsQuery({
    limit: filters?.limit || 12,
    page: filters?.page || 1,
    searchTerm: filters?.searchTerm || "",
    category_id: filters?.category_id || "",
    fromPrice: filters?.fromPrice || "",
    toPrice: filters?.toPrice || "",
    sortByNewest: filters?.sortByNewest || "",
    sortOrder: filters?.sortOrder || "",
    HighToLow: filters?.HighToLow || "",
    lowToHigh: filters?.lowToHigh || "",
  });

  const products = productsData?.data || [];
  const totalCount = productsData?.meta?.total || 0;

  // Centralized Error Handling
  useEffect(() => {
    if (isError && error) {
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        "Failed to load products. Please try again.";

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
    products,
    totalCount,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
