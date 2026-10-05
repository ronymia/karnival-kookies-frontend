"use client";

import { useCreateCampaignMutation } from "@/redux/apis/campaignApis";

export default function useCreateCampaign() {
  return useCreateCampaignMutation();
}
