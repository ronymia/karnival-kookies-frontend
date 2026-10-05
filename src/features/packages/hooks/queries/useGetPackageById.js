"use client";

import { useEffect } from "react";
import { useGetPackageByIdQuery } from "@/redux/apis/packageApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching a single package by ID.
 */
export default function useGetPackageById(id, options = {}) {
  const queryResult = useGetPackageByIdQuery({ id }, { skip: !id, ...options });
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const packageData = data?.data || null;

  return {
    package: packageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
