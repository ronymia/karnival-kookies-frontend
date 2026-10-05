"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { Button } from "@/components/ui/buttons";
import { resetCart } from "@/redux/features/cartSlice";
import { useProceedPayment } from "../../hooks";
import { PaymentService, CartService } from "../../services";
import { FiLock, FiArrowLeft, FiShield, FiAlertCircle } from "react-icons/fi";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "14px",
      lineHeight: "22px",
      "::placeholder": {
        color: "#737373",
      },
      iconColor: "#c98d53",
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
  hidePostalCode: false,
};

export default function StripePaymentForm({ shippingInfo, finalTotal, onPrev }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const {
    selectedItems,
    totalPrice,
    appliedCoupon,
    activeCampaign,
    campaignDiscount,
    isFreeShipping,
  } = useSelector((state) => state.cart || {});

  const [proceedPayment, { isLoading: isProceeding }] = useProceedPayment();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Payment form not initialized properly. Please refresh.");
      return;
    }

    // 1. Validate prerequisites
    const validation = PaymentService.validatePaymentPrerequisites({
      cartItems: selectedItems,
      shippingInfo,
    });
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // 2. Build payload matching backend IProceedPaymentPayload
      const currentSubtotal = totalPrice || 0;
      const discountAmount = CartService.calculateDiscount(
        currentSubtotal,
        appliedCoupon
      );
      const effectiveDiscount = Math.max(discountAmount, campaignDiscount || 0);

      const proceedPayload = PaymentService.buildProceedPayload({
        cartItems: selectedItems,
        shippingInfo,
        evaluation: {
          net_amount: currentSubtotal,
          discount_amount: effectiveDiscount,
          total_amount: finalTotal,
          free_shipping: isFreeShipping,
          coupon_code: appliedCoupon?.code || activeCampaign?.coupon_code,
          campaign_id: activeCampaign?.id,
        },
        subtotal: currentSubtotal,
        discount: effectiveDiscount,
        total: finalTotal,
        userId: user?.id,
      });

      // 3. Call POST /api/v1.0/payments/proceed to create pending order and Stripe Intent
      const proceedRes = await proceedPayment(proceedPayload);
      const clientSecret = proceedRes?.clientSecret;
      const orderId = proceedRes?.order_id;
      const orderNumber = proceedRes?.order_number;

      if (!clientSecret) {
        throw new Error(
          proceedRes?.message || "Failed to initialize payment gateway token."
        );
      }

      // 4. Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingInfo?.recipient_name || "",
            email: shippingInfo?.email || "",
            phone: shippingInfo?.phone || "",
          },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Payment authorization failed");
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="error"
            text={result.error.message || "Card payment failed"}
          />
        ));
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        // 5. Payment succeeded: Clear cart and redirect to order success page
        dispatch(resetCart());

        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Payment authorized! Your artisanal batch is confirmed."
          />
        ));

        const targetUrl = orderId
          ? `/order/success?order_id=${orderId}&order_number=${orderNumber || ""}`
          : "/dashboard/order-history";

        router.push(targetUrl);
      } else {
        setErrorMessage("Payment status pending verification. Please check your order history.");
      }
    } catch (err) {
      const msg = err?.data?.message || err?.message || "Payment processing failed";
      setErrorMessage(msg);
      toast.custom((t) => <CustomToaster t={t} type="error" text={msg} />);
    } finally {
      setIsProcessing(false);
    }
  };

  const busy = isProcessing || isProceeding;

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      {/* STRIPE CARD ELEMENT CONTAINER */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-300 block">
          Credit or Debit Card
        </label>
        <div className="p-4 rounded-2xl bg-[#14110f] border border-white/10 shadow-inner focus-within:border-primary/50 transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium flex items-center gap-2">
          <FiAlertCircle className="text-base shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECURITY NOTICE */}
      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
        <FiShield className="text-primary shrink-0" />
        <span>Card information is encrypted end-to-end directly via Stripe PCI-DSS Level 1 security.</span>
      </div>

      {/* NAVIGATION & ACTION BUTTONS */}
      <div className="flex items-center justify-between pt-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={onPrev}
          text="Back to Review"
          startIcon={FiArrowLeft}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!stripe || !elements || busy}
          isLoading={busy}
          text={busy ? "Authorizing..." : `Pay $${Number(finalTotal || 0).toFixed(2)}`}
          startIcon={FiLock}
          className="shadow-lg shadow-primary/20 px-8"
        />
      </div>
    </form>
  );
}

StripePaymentForm.propTypes = {
  shippingInfo: PropTypes.object.isRequired,
  finalTotal: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
};
