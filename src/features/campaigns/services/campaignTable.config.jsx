import React from "react";
import toast from "react-hot-toast";
import { FiCopy, FiZap, FiTag, FiCalendar } from "react-icons/fi";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import CampaignTypeBadge from "../components/CampaignTypeBadge";
import CampaignStatusToggle from "../components/CampaignStatusToggle";
import { CampaignService } from "./campaignService";

export const CAMPAIGN_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "CAMPAIGN",
    accessorKey: "campaign_info",
    minWidth: 28,
    show: true,
    isMainField: true,
  },
  {
    header: "TYPE",
    accessorKey: "type_badge",
    minWidth: 16,
    show: true,
  },
  {
    header: "TRIGGER",
    accessorKey: "trigger_badge",
    minWidth: 18,
    show: true,
  },
  {
    header: "REWARD",
    accessorKey: "reward_display",
    minWidth: 18,
    show: true,
  },
  {
    header: "MIN SPEND",
    accessorKey: "min_spend_display",
    minWidth: 14,
    show: true,
  },
  {
    header: "STATUS",
    accessorKey: "status_toggle",
    minWidth: 12,
    show: true,
  },
];

/**
 * Formats raw campaigns into table rows with interactive elements.
 */
export function formatCampaignRows(
  campaigns = [],
  onToggleStatus,
  currentPage = 1,
  pageSize = 10
) {
  if (!Array.isArray(campaigns)) return [];

  const handleCopyCode = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={`Copied promo code "${code}"!`}
        />
      ));
    }
  };

  return campaigns.map((c, idx) => {
    const isCoupon = c.trigger_type === "coupon";
    const minSpend = Number(c.minimum_spend || 0);

    return {
      ...c,
      count: (currentPage - 1) * pageSize + idx + 1,

      // CAMPAIGN TITLE & DESCRIPTION
      campaign_info: (
        <div className="py-1 min-w-0 max-w-xs">
          <p className="font-serif font-medium text-white text-sm truncate">
            {c.title || "Untitled Campaign"}
          </p>
          {c.description && (
            <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
              {c.description}
            </p>
          )}
          {(c.start_date || c.end_date) && (
            <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-1">
              <FiCalendar className="text-[10px]" />
              <span>
                {c.start_date || "Always"} &rarr; {c.end_date || "Ongoing"}
              </span>
            </div>
          )}
        </div>
      ),

      // CAMPAIGN TYPE BADGE
      type_badge: <CampaignTypeBadge type={c.campaign_type} />,

      // TRIGGER BADGE (AUTOMATIC VS COUPON CODE)
      trigger_badge: isCoupon ? (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 font-mono text-xs">
          <FiTag className="text-xs shrink-0" />
          <span className="font-bold">{c.coupon_code || "CODE"}</span>
          {c.coupon_code && (
            <button
              type="button"
              onClick={() => handleCopyCode(c.coupon_code)}
              title="Copy promo code"
              className="hover:text-white p-0.5 transition-colors cursor-pointer"
            >
              <FiCopy className="text-[10px]" />
            </button>
          )}
        </div>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <FiZap className="text-xs" />
          <span>Automatic</span>
        </span>
      ),

      // REWARD
      reward_display: (
        <span className="font-mono font-semibold text-primary text-sm">
          {CampaignService.formatReward(c)}
        </span>
      ),

      // MINIMUM SPEND
      min_spend_display: (
        <span className="font-mono text-xs text-neutral-300">
          {minSpend > 0 ? `$${minSpend.toFixed(2)}` : "None ($0)"}
        </span>
      ),

      // STATUS TOGGLE SWITCH
      status_toggle: (
        <CampaignStatusToggle
          isActive={c.is_active !== false}
          onToggle={() => onToggleStatus && onToggleStatus(c)}
        />
      ),
    };
  });
}
