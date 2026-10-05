"use client";

import { useOrderStatusChangeMutation } from "@/redux/apis/orderApis";

export default function useOrderStatusChange() {
  return useOrderStatusChangeMutation();
}
