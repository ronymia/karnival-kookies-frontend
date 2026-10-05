"use client";

import { useUpdateMetaDataMutation } from "@/redux/apis/metaDataApis";

export default function useUpdateMetaData() {
  return useUpdateMetaDataMutation();
}
