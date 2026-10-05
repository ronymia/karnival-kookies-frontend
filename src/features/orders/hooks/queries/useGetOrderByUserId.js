"use client";

import { useEffect } from "react";
import { useGetOrderByUserIdQuery } from "@/redux/apis/orderApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching orders by specific user ID.
 */
export default function useGetOrderByUserId(userId, params = {}, options = {}) {
  const queryResult = useGetOrderByUserIdQuery(
    { user_id: userId, ...params },
    { skip: !userId, ...options }
  );
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const orders = data?.data || [];
  const meta = data?.meta || {};

  return {
    orders,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
