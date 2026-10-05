import React from "react";
import toast from "react-hot-toast";
import { FiCopy, FiCheck } from "react-icons/fi";
import CustomToaster from "@/components/ui/toaster/CustomToaster";

export const COUPON_CODE_TABLE_COLUMNS = [
  {
    header: "#",
    accessorKey: "count",
    minWidth: 5,
    show: true,
    isMainField: true,
  },
  {
    header: "COUPON CODE",
    accessorKey: "code_badge",
    minWidth: 25,
    show: true,
    isMainField: true,
  },
  {
    header: "DISCOUNT TYPE",
    accessorKey: "discount_type_badge",
    minWidth: 20,
    show: true,
  },
  {
    header: "DISCOUNT VALUE",
    accessorKey: "discount_value_display",
    minWidth: 20,
    show: true,
  },
  {
    header: "MINIMUM SPEND",
    accessorKey: "minimum_spend_display",
    minWidth: 20,
    show: true,
  },
];

/**
 * Formats raw coupon codes into rich table rows.
 */
export function formatCouponCodeRows(
  coupons = [],
  currentPage = 1,
  pageSize = 10
) {
  if (!Array.isArray(coupons)) return [];

  const handleCopyCode = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text={`Copied "${code}" to clipboard!`}
        />
      ));
    }
  };

  return coupons.map((c, idx) => {
    const isPercent = c.discount_type === "percent";
    const discountVal = Number(c.discount_value) || 0;
    const minSpend = Number(c.minimum_spend) || 0;

    return {
      ...c,
      count: (currentPage - 1) * pageSize + idx + 1,

      // COUPON CODE BADGE (WITH COPY BUTTON)
      code_badge: (
        <div className="flex items-center gap-2 py-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-sm tracking-wider shadow-sm">
            <span>{c.code}</span>
            <button
              type="button"
              onClick={() => handleCopyCode(c.code)}
              title="Copy code"
              className="p-1 rounded-md hover:bg-primary/20 text-primary/80 hover:text-primary transition-colors cursor-pointer"
            >
              <FiCopy className="text-xs" />
            </button>
          </div>
        </div>
      ),

      // DISCOUNT TYPE BADGE
      discount_type_badge: (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
            isPercent
              ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
              : "bg-blue-500/15 border-blue-500/30 text-blue-300"
          }`}
        >
          {isPercent ? "Percentage (%)" : "Fixed Amount ($)"}
        </span>
      ),

      // DISCOUNT VALUE
      discount_value_display: (
        <span className="font-sans font-bold text-white text-sm">
          {isPercent ? `${discountVal}% OFF` : `$${discountVal.toFixed(2)} OFF`}
        </span>
      ),

      // MINIMUM SPEND
      minimum_spend_display: (
        <span className="text-xs font-medium text-neutral-300">
          {minSpend > 0 ? (
            <strong className="text-white">${minSpend.toFixed(2)}</strong>
          ) : (
            <span className="text-neutral-500">No Minimum</span>
          )}
        </span>
      ),
    };
  });
}
