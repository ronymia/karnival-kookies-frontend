"use client";

import { useEffect } from "react";
import { useGetCategoryByIdQuery } from "@/redux/apis/categoryApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching a single category by ID.
 */
export default function useGetCategoryById(id, options = {}) {
  const queryResult = useGetCategoryByIdQuery(
    { id },
    { skip: !id, ...options }
  );
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const category = data?.data || null;

  return {
    category,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
