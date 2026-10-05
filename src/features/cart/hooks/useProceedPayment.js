"use client";

import { useProceedPaymentMutation } from "@/redux/apis/paymentApis";

export default function useProceedPayment() {
  const [proceedMutation, status] = useProceedPaymentMutation();

  const proceed = async (payload) => {
    const res = await proceedMutation(payload).unwrap();
    // Return the response data (clientSecret, paymentIntentId, order_id, order_number)
    return res?.data || res;
  };

  return [proceed, status];
}
