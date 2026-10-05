"use client";

import { useGetCampaignsQuery } from "@/redux/apis/campaignApis";
import { sampleCampaigns } from "../../data";

/**
 * Custom query hook for fetching paginated and filtered campaigns.
 * Seamlessly falls back to sampleCampaigns if backend is in progress.
 */
export default function useGetCampaigns(
  params = { page: 1, limit: 100 },
  options = {}
) {
  const queryResult = useGetCampaignsQuery(params, options);
  const { data, isLoading, isFetching, isError, error, refetch } = queryResult;

  const rawCampaigns = Array.isArray(data?.data) ? data.data : null;
  // If backend returns data use it, otherwise fall back to sampleCampaigns catalog
  const campaigns = rawCampaigns && rawCampaigns.length > 0 ? rawCampaigns : sampleCampaigns;
  const meta = data?.meta || {};
  const totalCount = meta.total || campaigns.length || 0;
  const totalPages = meta.total_page || 1;

  return {
    campaigns,
    meta,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    rawResponse: data,
  };
}
