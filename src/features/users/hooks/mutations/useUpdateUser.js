"use client";

import { useUpdateUserMutation } from "@/redux/apis/userApis";

export default function useUpdateUser() {
  return useUpdateUserMutation();
}
