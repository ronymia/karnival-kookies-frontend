// ==================== ORDER DOMAIN SERVICE (PURE JS) ====================

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "amber" },
  { value: "confirmed", label: "Confirmed", color: "blue" },
  { value: "preparing", label: "Preparing in Bakery", color: "purple" },
  { value: "shipped", label: "Shipped & In Transit", color: "cyan" },
  { value: "delivered", label: "Delivered", color: "emerald" },
  { value: "cancelled", label: "Cancelled", color: "red" },
];

export const PAYMENT_METHODS = [
  { value: "stripe", label: "Credit Card (Stripe)" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "paypal", label: "PayPal" },
  { value: "apple_pay", label: "Apple Pay" },
];

export const ORDER_SORT_OPTIONS = [
  { value: "", label: "Default Order" },
  { value: "newest", label: "Newest Orders" },
  { value: "oldest", label: "Oldest Orders" },
  { value: "amount-high", label: "Amount: High to Low" },
  { value: "amount-low", label: "Amount: Low to High" },
];

export class OrderService {
  /**
   * Formats order status into human readable label.
   */
  static formatStatus(status) {
    if (!status) return "Pending";
    const found = ORDER_STATUSES.find((s) => s.value === status);
    if (found) return found.label;

    return status
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /**
   * Formats payment method key.
   */
  static formatPaymentMethod(method) {
    if (!method) return "Card Payment";
    const found = PAYMENT_METHODS.find((p) => p.value === method);
    if (found) return found.label;

    return method
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /**
   * Calculates total order payable amount safely.
   */
  static calculateTotal(order) {
    if (!order) return 0;
    if (order.totalAmount !== undefined && !isNaN(Number(order.totalAmount))) {
      return Number(order.totalAmount);
    }
    if (order.totalPayableAmount !== undefined && !isNaN(Number(order.totalPayableAmount))) {
      return Number(order.totalPayableAmount);
    }

    if (Array.isArray(order.order_items)) {
      return order.order_items.reduce((sum, item) => {
        const price = Number(item.price || item.unit_price || 0);
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
      }, 0);
    }

    if (Array.isArray(order.paymentInfo)) {
      return order.paymentInfo.reduce((sum, item) => {
        const prod = item.product || {};
        const price = Number(prod.discount_price || prod.regular_price || 0);
        const qty = Number(item.quantity || 1);
        return sum + price * qty;
      }, 0);
    }

    return 0;
  }

  /**
   * Generates default pagination and filter state.
   */
  static getDefaultFilters() {
    return {
      page: 1,
      limit: 10,
      searchTerm: "",
      status: "",
      payment_method: "",
      sortBy: "",
    };
  }

  /**
   * Filters and sorts orders client-side.
   */
  static filterAndSort(orders = [], filters = {}) {
    let list = Array.isArray(orders) ? [...orders] : [];

    const {
      searchTerm = "",
      status = "",
      payment_method = "",
      sortBy = "",
    } = filters;

    // Search by order_number, tracking_number, customer email, customer name
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      list = list.filter((o) => {
        const orderNum = String(o.order_number || o.orderId || "").toLowerCase();
        const trackNum = String(o.tracking_number || "").toLowerCase();
        const email = String(
          o.shipping_info?.email || o.checkoutInfo?.email || o.userEmail || o.email || ""
        ).toLowerCase();
        const name = String(
          o.shipping_info?.name || o.checkoutInfo?.name || o.name || ""
        ).toLowerCase();

        return (
          orderNum.includes(term) ||
          trackNum.includes(term) ||
          email.includes(term) ||
          name.includes(term)
        );
      });
    }

    // Status filter
    if (status) {
      list = list.filter((o) => o.status === status);
    }

    // Payment method filter
    if (payment_method) {
      list = list.filter((o) => (o.payment_method || o.paymentMethod) === payment_method);
    }

    return OrderService.sortOrders(list, sortBy);
  }

  /**
   * Sorts orders by criteria.
   */
  static sortOrders(orders = [], sortBy = "") {
    if (!sortBy || !Array.isArray(orders)) return orders;

    const sorted = [...orders];

    switch (sortBy) {
      case "amount-high":
        return sorted.sort(
          (a, b) => OrderService.calculateTotal(b) - OrderService.calculateTotal(a)
        );
      case "amount-low":
        return sorted.sort(
          (a, b) => OrderService.calculateTotal(a) - OrderService.calculateTotal(b)
        );
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt || 0) -
            new Date(a.created_at || a.createdAt || 0)
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.created_at || a.createdAt || 0) -
            new Date(b.created_at || b.createdAt || 0)
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
    status = "",
    payment_method = "",
    sortBy = "",
    onRemoveSearch,
    onRemoveStatus,
    onRemovePaymentMethod,
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

    if (status) {
      chips.push({
        id: "status",
        label: `Status: ${OrderService.formatStatus(status)}`,
        onRemove: onRemoveStatus,
      });
    }

    if (payment_method) {
      chips.push({
        id: "payment",
        label: `Payment: ${OrderService.formatPaymentMethod(payment_method)}`,
        onRemove: onRemovePaymentMethod,
      });
    }

    if (sortBy) {
      const opt = ORDER_SORT_OPTIONS.find((s) => s.value === sortBy);
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
