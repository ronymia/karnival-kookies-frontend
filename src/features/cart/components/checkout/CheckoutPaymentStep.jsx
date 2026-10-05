"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { usePaymentConfigQuery } from "@/redux/apis/paymentApis";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import { Button } from "@/components/ui/buttons";
import { CartService } from "../../services";
import StripePaymentForm from "./StripePaymentForm";
import { FiCreditCard, FiAlertCircle } from "react-icons/fi";

export default function CheckoutPaymentStep({
  shippingInfo,
  onPrev,
}) {
  const router = useRouter();
  const { totalPrice: checkoutTotal, appliedCoupon, campaignDiscount } = useSelector(
    (state) => state.cart || {}
  );

  const [stripePromise, setStripePromise] = useState(null);
  const { data: configData, isLoading: isConfigLoading } = usePaymentConfigQuery();

  const currentSubtotal = checkoutTotal || 0;
  const discountAmount = CartService.calculateDiscount(
    currentSubtotal,
    appliedCoupon
  );
  const effectiveDiscount = Math.max(discountAmount, campaignDiscount || 0);
  const finalTotal = Math.max(0, currentSubtotal - effectiveDiscount);

  useEffect(() => {
    const publishableKey = configData?.data?.publishableKey;
    if (publishableKey) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [configData]);

  if (isConfigLoading) {
    return (
      <div className="py-16 text-center space-y-4">
        <CustomLoading />
        <p className="text-xs text-neutral-400">
          Connecting to secure payment gateway...
        </p>
      </div>
    );
  }

  if (!finalTotal || finalTotal <= 0) {
    return (
      <div className="max-w-md mx-auto py-12 px-6 text-center rounded-2xl bg-white/[0.03] border border-white/10 space-y-5">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
          <FiAlertCircle className="text-xl" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-medium text-white">
            No Amount Due
          </h3>
          <p className="text-xs text-neutral-400">
            Your cart total is $0.00. Please add items to proceed.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/cart")}
          className="w-full"
        >
          Return to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <FiCreditCard className="text-lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Secure Card Payment
          </h2>
          <p className="text-xs text-neutral-400">
            Total to charge:{" "}
            <span className="font-mono font-bold text-primary">
              ${finalTotal.toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {stripePromise && (
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            shippingInfo={shippingInfo}
            finalTotal={finalTotal}
            onPrev={onPrev}
          />
        </Elements>
      )}
    </div>
  );
}

CheckoutPaymentStep.propTypes = {
  shippingInfo: PropTypes.object.isRequired,
  onPrev: PropTypes.func.isRequired,
};
