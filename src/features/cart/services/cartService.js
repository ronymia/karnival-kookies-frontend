// ==================== CART DOMAIN SERVICE (PURE JS) ====================

export const DEFAULT_DELIVERY_CHARGE = 0; // Configured as 00 for now

export class CartService {
  /**
   * Calculates the effective unit price of a cart product.
   */
  static getItemUnitPrice(cartItem) {
    if (!cartItem) return 0;
    const product = cartItem.product || {};

    if (product.is_discount_enable || product.is_discount) {
      if (product.net_price !== undefined && product.net_price !== null) {
        return parseFloat(product.net_price) || 0;
      }
      if (product.discount_price !== undefined && product.discount_price !== null) {
        return parseFloat(product.discount_price) || 0;
      }
    }

    if (product.price !== undefined && product.price !== null) {
      return parseFloat(product.price) || 0;
    }
    if (product.regular_price !== undefined && product.regular_price !== null) {
      return parseFloat(product.regular_price) || 0;
    }
    if (cartItem.price !== undefined && cartItem.price !== null) {
      return parseFloat(cartItem.price) || 0;
    }

    return 0;
  }

  /**
   * Calculates total for a single cart line item.
   */
  static calculateItemLineTotal(cartItem) {
    const unitPrice = CartService.getItemUnitPrice(cartItem);
    const qty = Math.max(1, parseInt(cartItem?.quantity || 1, 10));
    return unitPrice * qty;
  }

  /**
   * Calculates total subtotal for a collection of cart items.
   */
  static calculateSubtotal(items = []) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + CartService.calculateItemLineTotal(item), 0);
  }

  /**
   * Calculates total quantity count for a collection of cart items.
   */
  static calculateTotalQuantity(items = []) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + Math.max(0, parseInt(item?.quantity || 0, 10)), 0);
  }

  /**
   * Calculates discount amount based on subtotal and coupon.
   */
  static calculateDiscount(subtotal = 0, coupon = null) {
    if (!coupon || !subtotal || subtotal <= 0) return 0;
    const minSpend = Number(coupon.minimum_spend || 0);
    if (subtotal < minSpend) return 0;

    let discount = 0;
    if (coupon.discount_type === "percent") {
      discount = (subtotal * Number(coupon.discount_value || 0)) / 100;
    } else if (coupon.discount_type === "fixed") {
      discount = Number(coupon.discount_value || 0);
    }
    return Math.min(discount, subtotal);
  }

  /**
   * Calculates final total taking subtotal, coupon, and delivery into account.
   */
  static calculateFinalTotal(subtotal = 0, coupon = null, deliveryFee = DEFAULT_DELIVERY_CHARGE) {
    const discount = CartService.calculateDiscount(subtotal, coupon);
    const total = Math.max(0, subtotal - discount) + Number(deliveryFee || 0);
    return total;
  }

  /**
   * Validates if a coupon can be applied to current subtotal.
   */
  static validateCoupon(code, availableCoupons = [], subtotal = 0) {
    if (!code || !code.trim()) {
      return { valid: false, message: "Please enter a coupon code" };
    }
    const cleanCode = code.trim().toUpperCase();
    const found = availableCoupons.find(
      (c) => c.code?.toUpperCase() === cleanCode
    );

    if (!found) {
      return { valid: false, message: `Coupon "${cleanCode}" is invalid` };
    }

    if (found.status && found.status !== "active") {
      return { valid: false, message: "This coupon is no longer active" };
    }

    const minSpend = Number(found.minimum_spend || 0);
    if (subtotal < minSpend) {
      return {
        valid: false,
        message: `Coupon requires a minimum order of $${minSpend.toFixed(2)} (current: $${subtotal.toFixed(2)})`,
      };
    }

    const discountAmount = CartService.calculateDiscount(subtotal, found);
    return {
      valid: true,
      coupon: found,
      discountAmount,
      message: `Coupon "${cleanCode}" applied successfully!`,
    };
  }

  /**
   * Formats a numeric price into a USD currency string.
   */
  static formatCurrency(amount) {
    const val = Number(amount || 0);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  }

  /**
   * Validates cart before proceeding to checkout.
   */
  static validateCart(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return { valid: false, error: "Your cart is empty. Please select items to continue." };
    }

    const invalidItem = items.find((item) => !item.product_id && !item.product?.id);
    if (invalidItem) {
      return { valid: false, error: "One or more cart items has invalid product information." };
    }

    return { valid: true };
  }
}
