"use client";

import { useEffect } from "react";
import { useGetAllMetaDataQuery } from "@/redux/apis/metaDataApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching SEO meta data items.
 */
export default function useGetAllMetaData(params = {}, options = {}) {
  const queryResult = useGetAllMetaDataQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const metaDataList = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || metaDataList.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    metaDataList,
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
