"use client";

import { useEffect } from "react";
import { useGetFaqsQuery } from "@/redux/apis/faqApi";
import { errorHandler } from "@/helpers/errorHandler";

/**
 * Custom query hook for fetching paginated FAQs.
 */
export default function useGetFaqs(
  params = { page: 1, limit: 100 },
  options = {}
) {
  const queryResult = useGetFaqsQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const faqs = data?.data || [];
  const meta = data?.meta || {};
  const totalCount = meta.total || faqs.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    faqs,
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
