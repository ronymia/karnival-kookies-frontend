"use client";

import { useCreateFaqMutation } from "@/redux/apis/faqApi";

export default function useCreateFaq() {
  return useCreateFaqMutation();
}
