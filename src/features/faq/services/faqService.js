// ==================== FAQ DOMAIN SERVICE (PURE JS) ====================

export const FAQ_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "question-asc", label: "Question: A to Z" },
  { value: "question-desc", label: "Question: Z to A" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export class FaqService {
  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      sortBy: "",
    };
  }

  /**
   * Filters and sorts FAQs client-side.
   */
  static filterAndSort(faqs = [], filters = {}) {
    let list = Array.isArray(faqs) ? [...faqs] : [];

    const { searchTerm = "", sortBy = "" } = filters;

    // Search by question or answer
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.question?.toLowerCase().includes(term) ||
          item.answer?.toLowerCase().includes(term)
      );
    }

    return FaqService.sortFaqs(list, sortBy);
  }

  /**
   * Sorts FAQs by criteria.
   */
  static sortFaqs(faqs = [], sortBy = "") {
    if (!sortBy || !Array.isArray(faqs)) return faqs;

    const sorted = [...faqs];

    switch (sortBy) {
      case "question-asc":
        return sorted.sort((a, b) =>
          (a.question || "").localeCompare(b.question || "")
        );
      case "question-desc":
        return sorted.sort((a, b) =>
          (b.question || "").localeCompare(a.question || "")
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
    sortBy = "",
    onRemoveSearch,
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

    if (sortBy) {
      const opt = FAQ_SORT_OPTIONS.find((s) => s.value === sortBy);
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
