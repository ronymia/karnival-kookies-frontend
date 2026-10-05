"use client";

import { useEffect } from "react";
import { useGetAllProductsQuery } from "@/redux/apis/productApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching paginated/filtered products.
 */
export default function useGetProducts(params = { page: 1, limit: 10 }, options = {}) {
  const queryResult = useGetAllProductsQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const products = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || products.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    products,
    meta,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
