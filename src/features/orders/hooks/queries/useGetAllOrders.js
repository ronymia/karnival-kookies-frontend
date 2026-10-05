"use client";

import { useEffect } from "react";
import { useGetAllOrdersQuery } from "@/redux/apis/orderApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching order list.
 */
export default function useGetAllOrders(
  params = { page: 1, limit: 100 },
  options = {}
) {
  const queryResult = useGetAllOrdersQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const orders = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || data?.total || orders.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    orders,
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
