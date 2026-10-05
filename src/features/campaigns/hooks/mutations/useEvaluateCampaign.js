"use client";

import { useEvaluateCartCampaignsMutation } from "@/redux/apis/campaignApis";
import { CampaignService } from "../../services";
import { sampleCampaigns } from "../../data";

export default function useEvaluateCampaign() {
  const [evaluateMutation, status] = useEvaluateCartCampaignsMutation();

  const evaluateCart = async ({ cart_items = [], coupon_code = "", user_id = null }) => {
    try {
      const res = await evaluateMutation({
        cart_items,
        coupon_code,
        user_id,
      }).unwrap();

      if (res?.data || res?.total_amount !== undefined) {
        return res?.data || res;
      }
    } catch (err) {
      // If remote API fails or endpoint not ready, fall back to local evaluation
    }

    // Local evaluation engine
    return CampaignService.evaluateCartLocally(cart_items, coupon_code, sampleCampaigns);
  };

  return [evaluateCart, status];
}
