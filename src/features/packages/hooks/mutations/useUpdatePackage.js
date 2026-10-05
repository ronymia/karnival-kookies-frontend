"use client";

import { useUpdatePackageMutation } from "@/redux/apis/packageApis";

export default function useUpdatePackage() {
  return useUpdatePackageMutation();
}
