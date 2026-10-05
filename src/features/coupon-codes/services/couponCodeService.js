// ==================== COUPON CODE DOMAIN SERVICE (PURE JS) ====================

export const COUPON_DISCOUNT_TYPES = [
  { value: "fixed", label: "Fixed Discount ($)" },
  { value: "percent", label: "Percentage Discount (%)" },
];

export const COUPON_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "code-asc", label: "Code: A to Z" },
  { value: "code-desc", label: "Code: Z to A" },
  { value: "discount-high", label: "Discount Value: High to Low" },
  { value: "discount-low", label: "Discount Value: Low to High" },
  { value: "min-spend-high", label: "Minimum Spend: High to Low" },
  { value: "min-spend-low", label: "Minimum Spend: Low to High" },
];

export class CouponCodeService {
  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      discount_type: "",
      minDiscount: "",
      maxDiscount: "",
      sortBy: "",
    };
  }

  /**
   * Filters and sorts coupon codes client-side.
   */
  static filterAndSort(coupons = [], filters = {}) {
    let list = Array.isArray(coupons) ? [...coupons] : [];

    const {
      searchTerm = "",
      discount_type = "",
      minDiscount = "",
      maxDiscount = "",
      sortBy = "",
    } = filters;

    // Search by code
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((c) => c.code?.toLowerCase().includes(term));
    }

    // Filter by discount type
    if (discount_type) {
      list = list.filter((c) => c.discount_type === discount_type);
    }

    // Min discount value
    if (minDiscount !== "" && !isNaN(Number(minDiscount))) {
      const min = Number(minDiscount);
      list = list.filter((c) => (Number(c.discount_value) || 0) >= min);
    }

    // Max discount value
    if (maxDiscount !== "" && !isNaN(Number(maxDiscount))) {
      const max = Number(maxDiscount);
      list = list.filter((c) => (Number(c.discount_value) || 0) <= max);
    }

    return CouponCodeService.sortCoupons(list, sortBy);
  }

  /**
   * Sorts coupons by criteria.
   */
  static sortCoupons(coupons = [], sortBy = "") {
    if (!sortBy || !Array.isArray(coupons)) return coupons;

    const sorted = [...coupons];

    switch (sortBy) {
      case "code-asc":
        return sorted.sort((a, b) =>
          (a.code || "").localeCompare(b.code || "")
        );
      case "code-desc":
        return sorted.sort((a, b) =>
          (b.code || "").localeCompare(a.code || "")
        );
      case "discount-high":
        return sorted.sort(
          (a, b) =>
            (Number(b.discount_value) || 0) - (Number(a.discount_value) || 0)
        );
      case "discount-low":
        return sorted.sort(
          (a, b) =>
            (Number(a.discount_value) || 0) - (Number(b.discount_value) || 0)
        );
      case "min-spend-high":
        return sorted.sort(
          (a, b) =>
            (Number(b.minimum_spend) || 0) - (Number(a.minimum_spend) || 0)
        );
      case "min-spend-low":
        return sorted.sort(
          (a, b) =>
            (Number(a.minimum_spend) || 0) - (Number(b.minimum_spend) || 0)
        );
      default:
        return sorted;
    }
  }

  /**
   * Builds active chips list for UI feedback.
   */
  static formatActiveChips({
    searchTerm = "",
    discount_type = "",
    minDiscount = "",
    maxDiscount = "",
    sortBy = "",
    onRemoveSearch,
    onRemoveType,
    onRemoveDiscountRange,
    onRemoveSort,
  } = {}) {
    const chips = [];

    if (searchTerm && searchTerm.trim()) {
      chips.push({
        id: "search",
        label: `Code: "${searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (discount_type) {
      chips.push({
        id: "type",
        label: `Type: ${discount_type === "percent" ? "Percentage" : "Fixed ($)"}`,
        onRemove: onRemoveType,
      });
    }

    if (minDiscount !== "" || maxDiscount !== "") {
      const min = minDiscount !== "" ? minDiscount : "0";
      const max = maxDiscount !== "" ? maxDiscount : "∞";
      chips.push({
        id: "discount-range",
        label: `Value: ${min} - ${max}`,
        onRemove: onRemoveDiscountRange,
      });
    }

    if (sortBy) {
      const opt = COUPON_SORT_OPTIONS.find((s) => s.value === sortBy);
      if (opt && opt.value) {
        chips.push({
          id: "sort",
          label: `Sort: ${opt.label}`,
          onRemove: onRemoveSort,
        });
      }
    }

    return chips;
  }
}
