// ==================== PRODUCT SERVICE ====================

export const PRICE_PRESETS = [
  { label: "Under $10", min: "", max: "10" },
  { label: "$10 - $25", min: "10", max: "25" },
  { label: "$25+", min: "25", max: "" },
];

export const SORT_OPTIONS = [
  { value: "", label: "Featured / Popular" },
  { value: "newest", label: "Newest Creations First" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
];

export class ProductService {
  /**
   * Generates the default filter state for products.
   */
  static getDefaultFilters(searchTerm = "") {
    return {
      searchTerm,
      page: 1,
      limit: 12,
      category_id: "",
      fromPrice: "",
      toPrice: "",
      sortByNewest: "",
      sortOrder: "",
      HighToLow: "",
      lowToHigh: "",
    };
  }

  /**
   * Maps a high-level sort option to backend API query parameters.
   */
  static mapSortToQueryParams(sortKey) {
    return {
      sortByNewest: sortKey === "newest" ? "true" : "",
      lowToHigh: sortKey === "lowToHigh" ? "lowToHigh" : "",
      HighToLow: sortKey === "highToLow" ? "highToLow" : "",
    };
  }

  /**
   * Extracts the active sort key from a filters object.
   */
  static extractSortKey(filters) {
    if (filters?.sortByNewest) return "newest";
    if (filters?.lowToHigh) return "lowToHigh";
    if (filters?.HighToLow) return "highToLow";
    return "";
  }

  /**
   * Returns a human-friendly label for a sort key.
   */
  static getSortLabel(sortKey) {
    const match = SORT_OPTIONS.find((opt) => opt.value === sortKey);
    return match ? match.label : "";
  }

  /**
   * Counts how many distinct filter criteria are currently active.
   */
  static countActiveFilters(filters) {
    let count = 0;
    if (filters?.category_id) count += 1;
    if (filters?.fromPrice || filters?.toPrice) count += 1;
    if (filters?.sortByNewest || filters?.lowToHigh || filters?.HighToLow) {
      count += 1;
    }
    return count;
  }

  /**
   * Formats active filter chips with labels and dismissal callbacks.
   */
  static formatActiveChips({
    filters,
    categories = [],
    maxBoundPrice = 100,
    onRemoveCategory,
    onRemoveSearch,
    onRemovePrice,
    onRemoveSort,
  }) {
    const chips = [];

    const activeCategory = categories.find(
      (c) => String(c.id) === String(filters?.category_id)
    );

    if (activeCategory) {
      chips.push({
        id: "category",
        label: `Category: ${activeCategory.name}`,
        onRemove: onRemoveCategory,
      });
    }

    if (filters?.searchTerm) {
      chips.push({
        id: "search",
        label: `"${filters.searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (filters?.fromPrice || filters?.toPrice) {
      chips.push({
        id: "price",
        label: `Price: $${filters.fromPrice || "0"} - $${
          filters.toPrice || maxBoundPrice
        }`,
        onRemove: onRemovePrice,
      });
    }

    const sortKey = this.extractSortKey(filters);
    const sortLabel = this.getSortLabel(sortKey);
    if (sortLabel && sortKey !== "") {
      chips.push({
        id: "sort",
        label: `Sort: ${sortLabel}`,
        onRemove: onRemoveSort,
      });
    }

    return chips;
  }

  /**
   * Calculates total pages given total items and items per page limit.
   */
  static calculateTotalPages(totalCount, limit = 12) {
    if (!totalCount || totalCount <= 0) return 1;
    return Math.max(1, Math.ceil(totalCount / (limit || 12)));
  }

  /**
   * Validates price range bounds.
   */
  static validatePriceRange(fromPrice, toPrice) {
    if (fromPrice && toPrice) {
      const min = Number(fromPrice);
      const max = Number(toPrice);
      if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) {
        return {
          valid: false,
          error: "Minimum price cannot be greater than maximum price.",
        };
      }
    }
    return { valid: true, error: null };
  }
}

export const productService = ProductService;
