"use client";

import { useDeleteCampaignMutation } from "@/redux/apis/campaignApis";

export default function useDeleteCampaign() {
  return useDeleteCampaignMutation();
}
