"use client";
import Button from "@/Shared/Button";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import { useRouter } from "next/navigation";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import {
  useCreatePaymentIntentMutation,
  useLazyPaymentConfigQuery,
} from "@/redux/apis/paymentApis";
import { useSelector } from "react-redux";

export default function PaymentStep4({ formData }) {
  const { totalPrice: checkoutTotal } = useSelector((state) => state.cart);
  const router = useRouter();

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent, paymentIntentResult] =
    useCreatePaymentIntentMutation();
  const [paymentConfig] = useLazyPaymentConfigQuery();
  // console.log({ clientSecret, stripePromise });

  //
  useEffect(() => {
    const getPaymentConfig = async () => {
      try {
        await paymentConfig()
          .unwrap()
          .then(async (res) => {
            console.log({ config: res });
            const publishableKey = await res?.data?.publishableKey;
            setStripePromise(loadStripe(publishableKey));
          });
      } catch (error) {
        errorHandlerV2({ err });
      }
    };
    getPaymentConfig();
  }, []);

  //
  useEffect(() => {
    const paymentIntent = async () => {
      try {
        await createPaymentIntent({ price: checkoutTotal })
          .unwrap()
          .then(async (res) => {
            console.log({ paymentIntent: res });
            const clientSecret = await res?.data?.clientSecret;
            setClientSecret(clientSecret);
          });
      } catch (err) {
        errorHandlerV2({ err });
      }
    };
    paymentIntent();
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
