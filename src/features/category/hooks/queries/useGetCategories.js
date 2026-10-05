"use client";

import { useEffect } from "react";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching paginated/filtered category list.
 */
export default function useGetCategories(params = { page: 1, limit: 20 }, options = {}) {
  const queryResult = useGetAllCategoriesQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const categories = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || categories.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    categories,
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
