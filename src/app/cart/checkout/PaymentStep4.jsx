"use client";
import { useCartContext } from "@/Context/ProjectProvider";
import Button from "@/Shared/Button";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import { useRouter } from "next/navigation";

export default function PaymentStep4({ formData }) {
  console.log({ formData });
  const { checkoutTotal } = useCartContext();
  const router = useRouter();

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  console.log({ clientSecret, stripePromise });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/payment/config`, {
        withCredentials: true,
      })
      .then(async (res) => {
        const publishableKey = await res.data.publishableKey;
        setStripePromise(loadStripe(publishableKey));
      });
  }, []);

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/carts/payment/create-payment-intent`,
        { price: checkoutTotal },
        { withCredentials: true }
      )
      .then(async (res) => {
        const clientSecret = await res.data.clientSecret;
        setClientSecret(clientSecret);
      });
  }, []);

  return (
    <div
      className={`max-w-screen-xl mx-auto px-5 md:px-10 flex flex-col justify-center items-center gap-10 pt-32 mb-60 w-full `}
    >
      {clientSecret && stripePromise ? (
        <div className={`bg-base-300 text-base-300 p-10 rounded-lg`}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm formData={formData} />
          </Elements>
        </div>
      ) : (
        <div
          className={`text-base-300 p-5 rounded-lg flex flex-col justify-center items-center text-lg md:text-3xl space-y-5`}
        >
          <p>Please Select Some Products!</p>
          <Button text={"Go To Cart"} handler={() => router.push("/cart")} />
        </div>
      )}
    </div>
  );
}
