// ==================== CATEGORY DOMAIN SERVICE (PURE JS) ====================

export const CATEGORY_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export class CategoryService {
  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 20,
      sortBy: "",
    };
  }

  /**
   * Filters and sorts categories.
   */
  static filterAndSort(categories = [], { searchTerm = "", sortBy = "" } = {}) {
    let list = Array.isArray(categories) ? categories : [];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (cat) =>
          cat.name?.toLowerCase().includes(term) ||
          cat.description?.toLowerCase().includes(term)
      );
    }

    return CategoryService.sortCategories(list, sortBy);
  }

  /**
   * Sorts categories client-side according to the selected sort option.
   */
  static sortCategories(categories = [], sortBy = "") {
    if (!sortBy || !Array.isArray(categories)) return categories;

    const list = [...categories];

    switch (sortBy) {
      case "name-asc":
        return list.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return list.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "newest":
        return list.sort((a, b) => (b.id || 0) - (a.id || 0));
      case "oldest":
        return list.sort((a, b) => (a.id || 0) - (b.id || 0));
      default:
        return list;
    }
  }

  /**
   * Formats active chips for the FilterPanel.
   */
  static formatActiveChips({ searchTerm, sortBy, onRemoveSearch, onRemoveSort }) {
    const chips = [];

    if (searchTerm) {
      chips.push({
        id: "search",
        label: `"${searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (sortBy) {
      const match = CATEGORY_SORT_OPTIONS.find((opt) => opt.value === sortBy);
      if (match && match.value) {
        chips.push({
          id: "sort",
          label: `Sort: ${match.label}`,
          onRemove: onRemoveSort,
        });
      }
    }

    return chips;
  }
}

export const categoryService = CategoryService;
