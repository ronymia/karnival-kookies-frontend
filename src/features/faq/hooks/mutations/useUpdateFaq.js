"use client";

import { useUpdateFaqMutation } from "@/redux/apis/faqApi";

export default function useUpdateFaq() {
  return useUpdateFaqMutation();
}
