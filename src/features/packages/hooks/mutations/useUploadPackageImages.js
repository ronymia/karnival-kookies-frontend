"use client";

import { useUploadPackageImagesMutation } from "@/redux/apis/packageApis";

export default function useUploadPackageImages() {
  return useUploadPackageImagesMutation();
}
