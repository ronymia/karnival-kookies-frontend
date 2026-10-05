"use client";

import { useDeletePackageMutation } from "@/redux/apis/packageApis";

export default function useDeletePackage() {
  return useDeletePackageMutation();
}
