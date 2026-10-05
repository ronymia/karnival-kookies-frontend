"use client";

import { useGetFaqsQuery } from "@/redux/apis/faqApi";
import { FALLBACK_FAQS } from "../services";

/**
 * Custom hook to fetch FAQs with graceful fallback to bakery defaults.
 */
export default function useFaqs() {
  const { data, isLoading, isError, refetch } = useGetFaqsQuery({});

  const backendFaqs = data?.data || [];
  const faqs = backendFaqs.length > 0 ? backendFaqs : FALLBACK_FAQS;

  return {
    faqs,
    isLoading,
    isError,
    refetch,
  };
}
