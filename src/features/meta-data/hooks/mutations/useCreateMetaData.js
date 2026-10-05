"use client";

import { useCreateMetaDataMutation } from "@/redux/apis/metaDataApis";

export default function useCreateMetaData() {
  return useCreateMetaDataMutation();
}
