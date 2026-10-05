"use client";

import { useEffect } from "react";
import { useGetAllPackagesQuery } from "@/redux/apis/packageApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching paginated and filtered packages.
 */
export default function useGetPackages(
  params = { page: 1, limit: 100 },
  options = {}
) {
  const queryResult = useGetAllPackagesQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const packages = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || packages.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    packages,
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
