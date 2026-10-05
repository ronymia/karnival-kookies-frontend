import React from "react";
import PropTypes from "prop-types";
import { FiPercent, FiTruck, FiGift, FiLayers, FiTag } from "react-icons/fi";

const TYPE_CONFIG = {
  discount: {
    label: "Discount",
    icon: FiPercent,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  free_shipping: {
    label: "Free Delivery",
    icon: FiTruck,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  bogo_same: {
    label: "BOGO (Same)",
    icon: FiLayers,
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  bogo_different: {
    label: "BOGO (Pairing)",
    icon: FiLayers,
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  free_item: {
    label: "Free Gift",
    icon: FiGift,
    className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
};

export default function CampaignTypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || {
    label: type || "Promo",
    icon: FiTag,
    className: "bg-white/5 text-neutral-300 border-white/10",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <Icon className="text-xs" />
      <span>{config.label}</span>
    </span>
  );
}

CampaignTypeBadge.propTypes = {
  type: PropTypes.string,
};
