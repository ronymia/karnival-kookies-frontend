/**
 * CampaignService
 * Pure business logic for promotional campaigns and cart evaluations.
 */
export class CampaignService {
  /**
   * Format human-readable reward description
   */
  static formatReward(campaign) {
    if (!campaign) return "No reward";

    switch (campaign.campaign_type) {
      case "discount":
        return campaign.discount_type === "percent"
          ? `${campaign.discount_value}% Off`
          : `$${Number(campaign.discount_value).toFixed(2)} Off`;
      case "free_shipping":
        return "Free Cold-Packed Delivery";
      case "bogo_same":
        return `Buy ${campaign.buy_quantity || 1}, Get ${
          campaign.free_quantity || 1
        } Free`;
      case "bogo_different":
        return "BOGO (Free Pairing Item)";
      case "free_item":
        return `Free Gift (${campaign.free_quantity || 1}x Item)`;
      default:
        return "Special Promotion";
    }
  }

  /**
   * Evaluates cart items against available campaigns locally (used when offline/fallback)
   */
  static evaluateCartLocally(cartItems = [], couponCode = "", campaigns = []) {
    const activeCampaigns = campaigns.filter((c) => c.is_active !== false);

    // Compute raw subtotal
    const net_amount = cartItems.reduce((sum, item) => {
      const price = Number(item.price || item.unitPrice || item.product?.price || 0);
      const qty = Number(item.quantity || 1);
      return sum + price * qty;
    }, 0);

    let applied_campaign = null;
    let discount_amount = 0;
    let free_shipping = false;
    let free_items = [];

    const normalizedCode = couponCode ? couponCode.trim().toUpperCase() : "";

    // 1. First check if a coupon code was explicitly entered
    if (normalizedCode) {
      const matchedCouponCampaign = activeCampaigns.find(
        (c) =>
          c.trigger_type === "coupon" &&
          c.coupon_code &&
          c.coupon_code.toUpperCase() === normalizedCode
      );

      if (matchedCouponCampaign) {
        const minSpend = Number(matchedCouponCampaign.minimum_spend || 0);
        if (net_amount >= minSpend) {
          applied_campaign = matchedCouponCampaign;
          if (matchedCouponCampaign.campaign_type === "discount") {
            if (matchedCouponCampaign.discount_type === "percent") {
              discount_amount = (net_amount * Number(matchedCouponCampaign.discount_value)) / 100;
            } else {
              discount_amount = Math.min(net_amount, Number(matchedCouponCampaign.discount_value || 0));
            }
          } else if (matchedCouponCampaign.campaign_type === "free_shipping") {
            free_shipping = true;
          }
        }
      }
    }

    // 2. Check automatic promotions (e.g. automatic free delivery threshold, automatic gifts)
    for (const campaign of activeCampaigns) {
      if (campaign.trigger_type !== "automatic") continue;

      const minSpend = Number(campaign.minimum_spend || 0);
      if (net_amount >= minSpend) {
        if (campaign.campaign_type === "free_shipping") {
          free_shipping = true;
        } else if (campaign.campaign_type === "free_item") {
          free_items.push({
            name: "Artisanal Bonus Cookie Slice",
            quantity: campaign.free_quantity || 1,
            image: "/images/cookie-placeholder.jpg",
          });
        } else if (campaign.campaign_type === "bogo_same" && cartItems.length > 0) {
          const buyQty = Number(campaign.buy_quantity || 2);
          const hasEligibleItem = cartItems.some((i) => (i.quantity || 1) >= buyQty);
          if (hasEligibleItem) {
            free_items.push({
              name: "Complimentary Cookie Treat",
              quantity: campaign.free_quantity || 1,
              image: "/images/cookie-placeholder.jpg",
            });
          }
        }

        if (!applied_campaign) {
          applied_campaign = campaign;
        }
      }
    }

    const total_amount = Math.max(0, net_amount - discount_amount);

    return {
      is_valid: true,
      applied_campaign,
      net_amount,
      discount_amount,
      total_amount,
      free_shipping,
      free_items,
    };
  }

  /**
   * Filter and search campaigns
   */
  static filterCampaigns(campaigns = [], { searchTerm = "", campaignType = "all", status = "all" } = {}) {
    return campaigns.filter((c) => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesTitle = c.title?.toLowerCase().includes(term);
        const matchesCode = c.coupon_code?.toLowerCase().includes(term);
        const matchesDesc = c.description?.toLowerCase().includes(term);
        if (!matchesTitle && !matchesCode && !matchesDesc) return false;
      }

      // Campaign Type
      if (campaignType && campaignType !== "all") {
        if (c.campaign_type !== campaignType) return false;
      }

      // Status
      if (status && status !== "all") {
        const isActive = status === "active";
        if (c.is_active !== isActive) return false;
      }

      return true;
    });
  }
}
