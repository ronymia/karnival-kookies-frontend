"use client";

import { useCreateUserMutation } from "@/redux/apis/userApis";

export default function useCreateUser() {
  return useCreateUserMutation();
}
