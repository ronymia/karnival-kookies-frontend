// ==================== PACKAGE DOMAIN SERVICE (PURE JS) ====================

export const PACKAGE_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "stock-low", label: "Stock: Low to High" },
  { value: "stock-high", label: "Stock: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export const PACKAGE_UNITS = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "litre", label: "Litre (L)" },
  { value: "bag", label: "Bag" },
];

export const PACKAGE_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export class PackageService {
  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      unit: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      minQuantity: "",
      maxQuantity: "",
      sortBy: "",
    };
  }

  /**
   * Calculates net price based on discount settings.
   */
  static calculateNetPrice(pkg) {
    if (!pkg) return 0;
    const basePrice = Number(pkg.price) || 0;
    const isDiscount = Number(pkg.is_discount_enable) === 1;

    if (!isDiscount) return basePrice;

    const discountValue = Number(pkg.discount_value) || 0;
    if (pkg.discount_type === "percent") {
      const discounted = basePrice - (basePrice * discountValue) / 100;
      return Math.max(0, discounted);
    }

    if (pkg.discount_type === "fixed") {
      return Math.max(0, basePrice - discountValue);
    }

    return basePrice;
  }

  /**
   * Filters and sorts packages client-side.
   */
  static filterAndSort(packages = [], filters = {}) {
    let list = Array.isArray(packages) ? [...packages] : [];

    const {
      searchTerm = "",
      unit = "",
      status = "",
      minPrice = "",
      maxPrice = "",
      minQuantity = "",
      maxQuantity = "",
      sortBy = "",
    } = filters;

    // Search by package name
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((pkg) => pkg.name?.toLowerCase().includes(term));
    }

    // Unit filter
    if (unit) {
      list = list.filter((pkg) => pkg.unit === unit);
    }

    // Status filter
    if (status) {
      list = list.filter((pkg) => (pkg.status || "active") === status);
    }

    // Price range filter
    if (minPrice !== "" && !isNaN(Number(minPrice))) {
      const min = Number(minPrice);
      list = list.filter((pkg) => {
        const net = PackageService.calculateNetPrice(pkg);
        return net >= min;
      });
    }

    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      const max = Number(maxPrice);
      list = list.filter((pkg) => {
        const net = PackageService.calculateNetPrice(pkg);
        return net <= max;
      });
    }

    // Quantity range filter
    if (minQuantity !== "" && !isNaN(Number(minQuantity))) {
      const min = Number(minQuantity);
      list = list.filter((pkg) => (Number(pkg.quantity) || 0) >= min);
    }

    if (maxQuantity !== "" && !isNaN(Number(maxQuantity))) {
      const max = Number(maxQuantity);
      list = list.filter((pkg) => (Number(pkg.quantity) || 0) <= max);
    }

    // Sort order
    return PackageService.sortPackages(list, sortBy);
  }

  /**
   * Sorts packages by criteria.
   */
  static sortPackages(packages = [], sortBy = "") {
    if (!sortBy || !Array.isArray(packages)) return packages;

    const sorted = [...packages];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "price-low":
        return sorted.sort(
          (a, b) =>
            PackageService.calculateNetPrice(a) -
            PackageService.calculateNetPrice(b)
        );
      case "price-high":
        return sorted.sort(
          (a, b) =>
            PackageService.calculateNetPrice(b) -
            PackageService.calculateNetPrice(a)
        );
      case "stock-low":
        return sorted.sort(
          (a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0)
        );
      case "stock-high":
        return sorted.sort(
          (a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0)
        );
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
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
    unit = "",
    status = "",
    minPrice = "",
    maxPrice = "",
    minQuantity = "",
    maxQuantity = "",
    sortBy = "",
    onRemoveSearch,
    onRemoveUnit,
    onRemoveStatus,
    onRemovePriceRange,
    onRemoveQuantityRange,
    onRemoveSort,
  } = {}) {
    const chips = [];

    if (searchTerm && searchTerm.trim()) {
      chips.push({
        id: "search",
        label: `Name: "${searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (unit) {
      chips.push({
        id: "unit",
        label: `Unit: ${unit}`,
        onRemove: onRemoveUnit,
      });
    }

    if (status) {
      chips.push({
        id: "status",
        label: `Status: ${status === "active" ? "Active" : "Inactive"}`,
        onRemove: onRemoveStatus,
      });
    }

    if (minPrice !== "" || maxPrice !== "") {
      const min = minPrice !== "" ? `$${minPrice}` : "$0";
      const max = maxPrice !== "" ? `$${maxPrice}` : "∞";
      chips.push({
        id: "price-range",
        label: `Price: ${min} - ${max}`,
        onRemove: onRemovePriceRange,
      });
    }

    if (minQuantity !== "" || maxQuantity !== "") {
      const min = minQuantity !== "" ? minQuantity : "0";
      const max = maxQuantity !== "" ? maxQuantity : "∞";
      chips.push({
        id: "qty-range",
        label: `Stock: ${min} - ${max}`,
        onRemove: onRemoveQuantityRange,
      });
    }

    if (sortBy) {
      const opt = PACKAGE_SORT_OPTIONS.find((s) => s.value === sortBy);
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
