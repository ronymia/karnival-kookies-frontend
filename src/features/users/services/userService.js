// ==================== USER DOMAIN SERVICE (PURE JS) ====================

export const ENUM_USER_ROLE = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  CUSTOMER: "customer",
  PRODUCT_MANAGER: "product_manager",
  ORDER_MANAGER: "order_manager",
  CUSTOMER_SUPPORT: "customer_support",
  MARKETING_MANAGER: "marketing_manager",
  CONTENT_EDITOR: "content_editor",
  ANALYST: "analyst",
};

export const USER_ROLES = [
  { value: ENUM_USER_ROLE.SUPER_ADMIN, label: "Super Admin" },
  { value: ENUM_USER_ROLE.ADMIN, label: "Admin" },
  { value: ENUM_USER_ROLE.MANAGER, label: "Store Manager" },
  { value: ENUM_USER_ROLE.PRODUCT_MANAGER, label: "Product Manager" },
  { value: ENUM_USER_ROLE.ORDER_MANAGER, label: "Order & Dispatch Manager" },
  { value: ENUM_USER_ROLE.CUSTOMER_SUPPORT, label: "Customer Support" },
  { value: ENUM_USER_ROLE.MARKETING_MANAGER, label: "Marketing Specialist" },
  { value: ENUM_USER_ROLE.CONTENT_EDITOR, label: "Content Editor" },
  { value: ENUM_USER_ROLE.ANALYST, label: "Business Analyst" },
  { value: ENUM_USER_ROLE.CUSTOMER, label: "Customer" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const USER_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "email-asc", label: "Email: A to Z" },
  { value: "email-desc", label: "Email: Z to A" },
  { value: "newest", label: "Newest Joined" },
  { value: "oldest", label: "Oldest Joined" },
];

export class UserService {
  /**
   * Formats role key into human-readable label.
   */
  static formatRole(role) {
    if (!role) return "Customer";
    const found = USER_ROLES.find((r) => r.value === role);
    if (found) return found.label;

    return role
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
      role: "",
      is_verified: "",
      sortBy: "",
    };
  }

  /**
   * Filters and sorts users client-side.
   */
  static filterAndSort(users = [], filters = {}) {
    let list = Array.isArray(users) ? [...users] : [];

    const {
      searchTerm = "",
      role = "",
      is_verified = "",
      sortBy = "",
    } = filters;

    // Search by name, email, phone, city
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.profile?.name?.toLowerCase().includes(term) ||
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term) ||
          u.profile?.phone?.toLowerCase().includes(term) ||
          u.profile?.city?.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (role) {
      list = list.filter((u) => u.role === role);
    }

    // Email verified filter
    if (is_verified !== "" && is_verified !== undefined) {
      const targetVerified = is_verified === "true" || is_verified === true;
      list = list.filter(
        (u) => Boolean(u.is_email_verified) === targetVerified
      );
    }

    return UserService.sortUsers(list, sortBy);
  }

  /**
   * Sorts users by criteria.
   */
  static sortUsers(users = [], sortBy = "") {
    if (!sortBy || !Array.isArray(users)) return users;

    const sorted = [...users];

    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => {
          const nameA = a.profile?.name || a.name || "";
          const nameB = b.profile?.name || b.name || "";
          return nameA.localeCompare(nameB);
        });
      case "name-desc":
        return sorted.sort((a, b) => {
          const nameA = a.profile?.name || a.name || "";
          const nameB = b.profile?.name || b.name || "";
          return nameB.localeCompare(nameA);
        });
      case "email-asc":
        return sorted.sort((a, b) =>
          (a.email || "").localeCompare(b.email || "")
        );
      case "email-desc":
        return sorted.sort((a, b) =>
          (b.email || "").localeCompare(a.email || "")
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
    role = "",
    is_verified = "",
    sortBy = "",
    onRemoveSearch,
    onRemoveRole,
    onRemoveVerified,
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

    if (role) {
      chips.push({
        id: "role",
        label: `Role: ${UserService.formatRole(role)}`,
        onRemove: onRemoveRole,
      });
    }

    if (is_verified !== "" && is_verified !== undefined) {
      chips.push({
        id: "verified",
        label: `Email: ${is_verified === "true" ? "Verified" : "Unverified"}`,
        onRemove: onRemoveVerified,
      });
    }

    if (sortBy) {
      const opt = USER_SORT_OPTIONS.find((s) => s.value === sortBy);
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
