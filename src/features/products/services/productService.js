// ==================== PRODUCT DOMAIN SERVICE (PURE JS) ====================

export const PRODUCT_SORT_OPTIONS = [
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

export const PRODUCT_UNITS = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "litre", label: "Litre (L)" },
  { value: "bag", label: "Bag" },
];

export const PRODUCT_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export class ProductService {
  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      category_id: "",
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
  static calculateNetPrice(product) {
    if (!product) return 0;
    const price = Number(product.price) || 0;
    const isDiscount = Number(product.is_discount_enable) === 1;

    if (!isDiscount) return price;

    const discountVal = Number(product.discount_value) || 0;
    if (product.discount_type === "fixed") {
      return Math.max(0, price - discountVal);
    }
    if (product.discount_type === "percent") {
      return Math.max(0, price - (price * discountVal) / 100);
    }

    return price;
  }

  /**
   * Filters and sorts products client-side.
   */
  static filterAndSort(
    products = [],
    {
      searchTerm = "",
      categoryId = "",
      unit = "",
      status = "",
      minPrice = "",
      maxPrice = "",
      minQuantity = "",
      maxQuantity = "",
      sortBy = "",
    } = {}
  ) {
    let list = Array.isArray(products) ? products : [];

    // Filter ONLY by product name
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(term));
    }

    // Filter by category
    if (categoryId) {
      list = list.filter(
        (p) =>
          String(p.category_id) === String(categoryId) ||
          String(p.category?.id) === String(categoryId)
      );
    }

    // Filter by unit
    if (unit) {
      list = list.filter((p) => (p.unit || "pcs").toLowerCase() === unit.toLowerCase());
    }

    // Filter by status
    if (status) {
      list = list.filter((p) => (p.status || "active").toLowerCase() === status.toLowerCase());
    }

    // Filter by price range
    if (minPrice !== "" && !isNaN(Number(minPrice))) {
      list = list.filter(
        (p) => ProductService.calculateNetPrice(p) >= Number(minPrice)
      );
    }
    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      list = list.filter(
        (p) => ProductService.calculateNetPrice(p) <= Number(maxPrice)
      );
    }

    // Filter by quantity range
    if (minQuantity !== "" && !isNaN(Number(minQuantity))) {
      list = list.filter((p) => (Number(p.quantity) || 0) >= Number(minQuantity));
    }
    if (maxQuantity !== "" && !isNaN(Number(maxQuantity))) {
      list = list.filter((p) => (Number(p.quantity) || 0) <= Number(maxQuantity));
    }

    return ProductService.sortProducts(list, sortBy);
  }

  /**
   * Sorts products list.
   */
  static sortProducts(products = [], sortBy = "") {
    if (!sortBy || !Array.isArray(products)) return products;

    const list = [...products];

    switch (sortBy) {
      case "name-asc":
        return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "price-low":
        return list.sort(
          (a, b) => ProductService.calculateNetPrice(a) - ProductService.calculateNetPrice(b)
        );
      case "price-high":
        return list.sort(
          (a, b) => ProductService.calculateNetPrice(b) - ProductService.calculateNetPrice(a)
        );
      case "stock-low":
        return list.sort(
          (a, b) => (Number(a.quantity) || 0) - (Number(b.quantity) || 0)
        );
      case "stock-high":
        return list.sort(
          (a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0)
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
   * Formats active chips for FilterPanel.
   */
  static formatActiveChips({
    searchTerm,
    categoryName,
    unit,
    status,
    minPrice,
    maxPrice,
    minQuantity,
    maxQuantity,
    sortBy,
    onRemoveSearch,
    onRemoveCategory,
    onRemoveUnit,
    onRemoveStatus,
    onRemovePriceRange,
    onRemoveQuantityRange,
    onRemoveSort,
  }) {
    const chips = [];

    if (searchTerm) {
      chips.push({
        id: "search",
        label: `Name: "${searchTerm}"`,
        onRemove: onRemoveSearch,
      });
    }

    if (categoryName) {
      chips.push({
        id: "category",
        label: `Category: ${categoryName}`,
        onRemove: onRemoveCategory,
      });
    }

    if (unit) {
      const match = PRODUCT_UNITS.find((u) => u.value === unit);
      chips.push({
        id: "unit",
        label: `Unit: ${match?.label || unit}`,
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

    if (minPrice || maxPrice) {
      chips.push({
        id: "price",
        label: `Price: $${minPrice || 0} - $${maxPrice || "∞"}`,
        onRemove: onRemovePriceRange,
      });
    }

    if (minQuantity || maxQuantity) {
      chips.push({
        id: "quantity",
        label: `Stock: ${minQuantity || 0} - ${maxQuantity || "∞"} ${unit || "units"}`,
        onRemove: onRemoveQuantityRange,
      });
    }

    if (sortBy) {
      const match = PRODUCT_SORT_OPTIONS.find((opt) => opt.value === sortBy);
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

export const productService = ProductService;
