"use client";

import { useUpdateCampaignMutation } from "@/redux/apis/campaignApis";

export default function useUpdateCampaign() {
  return useUpdateCampaignMutation();
}
