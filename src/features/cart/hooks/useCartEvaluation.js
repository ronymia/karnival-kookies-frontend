"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCampaignEvaluation } from "@/redux/features/cartSlice";
import { useEvaluateCampaign } from "@/features/campaigns";
import { CartService } from "../services";

/**
 * Real-time debounced cart evaluation hook (300ms)
 * Automatically syncs active campaign, discount, free items, and shipping status with Redux.
 */
export default function useCartEvaluation({
  cartItems = [],
  couponCode = "",
  userId = null,
  debounceMs = 300,
} = {}) {
  const dispatch = useDispatch();
  const [evaluateCart, { isLoading: isEvaluating }] = useEvaluateCampaign();
  const timeoutRef = useRef(null);

  const {
    activeCampaign,
    campaignDiscount,
    freeItems,
    isFreeShipping,
  } = useSelector((state) => state.cart || {});

  useEffect(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const formattedItems = cartItems.map((item) => {
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
        });

        const res = await evaluateCart({
          cart_items: formattedItems,
          coupon_code: couponCode || "",
          user_id: userId || null,
        });

        if (res) {
          dispatch(setCampaignEvaluation(res));
        }
      } catch (err) {
        // Silently handled; falls back gracefully
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cartItems, couponCode, userId, debounceMs, evaluateCart, dispatch]);

  return {
    isEvaluating,
    activeCampaign,
    campaignDiscount,
    freeItems,
    isFreeShipping,
  };
}
