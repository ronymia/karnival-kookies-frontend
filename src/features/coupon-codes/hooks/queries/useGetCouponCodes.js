"use client";

import { useEffect } from "react";
import { useGetCouponCodesQuery } from "@/redux/apis/couponCodeApi";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching paginated and filtered coupon codes.
 */
export default function useGetCouponCodes(
  params = { page: 1, limit: 100 },
  options = {}
) {
  const queryResult = useGetCouponCodesQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const couponCodes = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || couponCodes.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    couponCodes,
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
