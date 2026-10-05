// ==================== PAYMENT DOMAIN SERVICE (PURE JS) ====================

export class PaymentService {
  /**
   * Builds the payload required by POST /api/v1.0/payments/proceed
   * Matching backend: IProceedPaymentPayload
   */
  static buildProceedPayload({
    cartItems = [],
    shippingInfo = {},
    evaluation = {},
    subtotal = 0,
    discount = 0,
    total = 0,
    userId = null,
  }) {
    const netAmount = Number(
      evaluation?.net_amount !== undefined ? evaluation.net_amount : subtotal
    );
    const discountAmount = Number(
      evaluation?.discount_amount !== undefined ? evaluation.discount_amount : discount
    );
    const totalAmount = Number(
      evaluation?.total_amount !== undefined ? evaluation.total_amount : total
    );
    const freeShipping = Boolean(
      evaluation?.free_shipping !== undefined ? evaluation.free_shipping : true
    );

    // Final price charged
    const finalChargedPrice = totalAmount;

    const payload = {
      price: Number(finalChargedPrice.toFixed(2)),
      net_amount: Number(netAmount.toFixed(2)),
      discount_amount: Number(discountAmount.toFixed(2)),
      total_amount: Number(totalAmount.toFixed(2)),
      free_shipping: freeShipping,
      order_items: (cartItems || []).map((item) => {
        const product = item?.product || {};
        const isDiscounted = product.is_discount_enable || product.is_discount;
        const unitPrice = isDiscounted
          ? parseFloat(product.net_price || product.discount_price || 0)
          : parseFloat(product.price || product.regular_price || item.price || 0);

        return {
          product_id: Number(item.product_id || product.id || item.id),
          quantity: Number(item.quantity || 1),
          price: Number(unitPrice.toFixed(2)),
        };
      }),
      shipping_info: {
        recipient_name: shippingInfo.recipient_name || "",
        email: shippingInfo.email || "",
        phone: shippingInfo.phone || "",
        address: shippingInfo.address || "",
        city: shippingInfo.city || "",
        postal_code: shippingInfo.postal_code || "",
        apartment: shippingInfo.apartment || "",
        state: shippingInfo.state || "",
        country: shippingInfo.country || "United States",
        carrier: shippingInfo.carrier || "Standard",
        delivery_instruction: shippingInfo.delivery_instruction || "",
      },
    };

    if (userId) {
      payload.user_id = Number(userId);
    }

    const couponCode =
      evaluation?.applied_campaign?.coupon_code ||
      evaluation?.coupon_code ||
      undefined;
    if (couponCode) {
      payload.coupon_code = couponCode;
    }

    const campaignId =
      evaluation?.applied_campaign?.id || evaluation?.campaign_id || undefined;
    if (campaignId) {
      payload.campaign_id = Number(campaignId);
    }

    return payload;
  }

  /**
   * Validates if payment step has everything required before calling proceed.
   */
  static validatePaymentPrerequisites({ cartItems, shippingInfo }) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        valid: false,
        error: "Your cart has no items selected. Please add items to proceed.",
      };
    }

    if (
      !shippingInfo?.recipient_name?.trim() ||
      !shippingInfo?.email?.trim() ||
      !shippingInfo?.address?.trim()
    ) {
      return {
        valid: false,
        error: "Shipping details are incomplete. Please return to step 1 to confirm.",
      };
    }

    return { valid: true };
  }
}
