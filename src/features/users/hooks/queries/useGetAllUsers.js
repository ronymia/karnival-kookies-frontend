"use client";

import { useEffect } from "react";
import { useGetAllUsersQuery } from "@/redux/apis/userApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching user accounts.
 */
export default function useGetAllUsers(params = { page: 1, limit: 100 }, options = {}) {
  const queryResult = useGetAllUsersQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const users = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || users.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    users,
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
