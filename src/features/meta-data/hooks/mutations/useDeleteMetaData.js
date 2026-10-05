"use client";

import { useDeleteMetaDataMutation } from "@/redux/apis/metaDataApis";

export default function useDeleteMetaData() {
  return useDeleteMetaDataMutation();
}
