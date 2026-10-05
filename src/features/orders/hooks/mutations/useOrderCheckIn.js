"use client";

import { useOrderCheckInMutation } from "@/redux/apis/orderApis";

export default function useOrderCheckIn() {
  return useOrderCheckInMutation();
}
