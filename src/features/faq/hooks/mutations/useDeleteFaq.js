"use client";

import { useDeleteFaqMutation } from "@/redux/apis/faqApi";

export default function useDeleteFaq() {
  return useDeleteFaqMutation();
}
