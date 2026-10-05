"use client";

import { useEffect } from "react";
import { useGetProductsByIdQuery } from "@/redux/apis/productApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching a single product by ID.
 */
export default function useGetProductById(id, options = {}) {
  const queryResult = useGetProductsByIdQuery(
    { id },
    { skip: !id, ...options }
  );
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const product = data?.data || null;

  return {
    product,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
