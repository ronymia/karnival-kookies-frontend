"use client";

import { useCreatePackageMutation } from "@/redux/apis/packageApis";

export default function useCreatePackage() {
  return useCreatePackageMutation();
}
