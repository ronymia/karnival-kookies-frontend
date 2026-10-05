// ==================== META DATA DOMAIN SERVICE (PURE JS) ====================

export const META_KEYS = [
  { value: "home_page", label: "Home Page" },
  { value: "product_page", label: "Product Catalog" },
  { value: "single_product", label: "Single Product Detail" },
  { value: "packages_page", label: "Combo Packages Page" },
  { value: "cart_page", label: "Shopping Cart Page" },
  { value: "checkout_page", label: "Checkout & Payment Page" },
  { value: "login", label: "Login Page" },
  { value: "register", label: "Register Page" },
  { value: "about_us", label: "About Us Page" },
  { value: "contact_us", label: "Contact Us Page" },
  { value: "faq_page", label: "FAQ Page" },
];

export const META_DATA_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
  { value: "key-asc", label: "Page Key: A to Z" },
  { value: "key-desc", label: "Page Key: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export class MetaDataService {
  /**
   * Formats a raw meta key into a human-readable page name.
   */
  static formatMetaKey(key) {
    if (!key) return "General Page";
    const found = META_KEYS.find((m) => m.value === key);
    if (found) return found.label;

    return key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      meta_key: "",
      sortBy: "",
    };
  }

  /**
   * Filters and sorts SEO metadata client-side.
   */
  static filterAndSort(items = [], filters = {}) {
    let list = Array.isArray(items) ? [...items] : [];

    const { searchTerm = "", meta_key = "", sortBy = "" } = filters;

    // Search by title or description
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title?.toLowerCase().includes(term) ||
          m.description?.toLowerCase().includes(term) ||
          m.meta_key?.toLowerCase().includes(term)
      );
    }

    // Filter by specific page key
    if (meta_key) {
      list = list.filter((m) => m.meta_key === meta_key);
    }

    return MetaDataService.sortMetaData(list, sortBy);
  }

  /**
   * Sorts metadata by criteria.
   */
  static sortMetaData(items = [], sortBy = "") {
    if (!sortBy || !Array.isArray(items)) return items;

    const sorted = [...items];

    switch (sortBy) {
      case "title-asc":
        return sorted.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
      case "title-desc":
        return sorted.sort((a, b) =>
          (b.title || "").localeCompare(a.title || "")
        );
      case "key-asc":
        return sorted.sort((a, b) =>
          (a.meta_key || "").localeCompare(b.meta_key || "")
        );
      case "key-desc":
        return sorted.sort((a, b) =>
          (b.meta_key || "").localeCompare(a.meta_key || "")
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
    meta_key = "",
    sortBy = "",
    onRemoveSearch,
    onRemoveKey,
    onRemoveSort,
  } = {}) {
    const chips = [];

    if (searchTerm && searchTerm.trim()) {
      chips.push({
        id: "search",
        label: `Search: "${searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (meta_key) {
      chips.push({
        id: "key",
        label: `Page: ${MetaDataService.formatMetaKey(meta_key)}`,
        onRemove: onRemoveKey,
      });
    }

    if (sortBy) {
      const opt = META_DATA_SORT_OPTIONS.find((s) => s.value === sortBy);
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
