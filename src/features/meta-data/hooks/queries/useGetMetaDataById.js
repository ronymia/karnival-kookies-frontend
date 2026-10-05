"use client";

import { useEffect } from "react";
import { useGetMetaDataByIdQuery } from "@/redux/apis/metaDataApis";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching a single SEO metadata item by ID.
 */
export default function useGetMetaDataById(id, options = {}) {
  const queryResult = useGetMetaDataByIdQuery({ id }, { skip: !id, ...options });
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const metaDataItem = data?.data || null;

  return {
    metaData: metaDataItem,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
