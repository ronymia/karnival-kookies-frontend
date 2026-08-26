"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import { useRouter } from "next/navigation";
import {
  useCreatePaymentIntentMutation,
  useLazyPaymentConfigQuery,
} from "@/redux/apis/paymentApis";
import { useSelector } from "react-redux";
import { errorHandler } from "@/helpers/errorHandler";
import Button from "@/components/ui/buttons/Button";
import CustomLoading from "@/components/ui/loader/CustomLoading";

export default function PaymentStep4({ formData, handlePrevStep }) {
  const { totalPrice: checkoutTotal } = useSelector((state) => state.cart);
  const router = useRouter();

  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent, paymentIntentResult] =
    useCreatePaymentIntentMutation();
  const [paymentConfig, paymentConfigResult] = useLazyPaymentConfigQuery();

  // GET PAYMENT CONFIG
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
      } catch (err) {
        errorHandler({ err });
      }
    };
    getPaymentConfig?.();
  }, []);

  //
  useEffect(() => {
    const paymentIntent = async () => {
      try {
        await createPaymentIntent({ price: Number(checkoutTotal?.toFixed(2)) })
          .unwrap()
          .then(async (res) => {
            console.log({ paymentIntent: res });
            const clientSecret = await res?.data?.clientSecret;
            setClientSecret(clientSecret);
          });
      } catch (err) {
        errorHandler({ err });
      }
    };
    paymentIntent();
  }, []);

  // LOADING STATE
  if (paymentIntentResult?.isLoading || paymentConfigResult?.isLoading) {
    return <CustomLoading />;
  }

  // IF GOT ERROR
  if (paymentConfigResult?.isError) {
    return <div>{paymentConfigResult?.error?.data?.message}</div>;
  }

  return (
    <div
      className={`max-w-screen-xl mx-auto px-5 md:px-10 flex flex-col justify-center items-center gap-10 pt-32 mb-60 w-full `}
    >
      {clientSecret && stripePromise ? (
        <div className={`bg-base-300 text-base-300 p-10 rounded-lg`}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm formData={formData} handlePrevStep={handlePrevStep} />
          </Elements>
        </div>
      ) : (
        <div
          className={`text-base-300 p-5 rounded-lg flex flex-col justify-center items-center text-lg md:text-3xl space-y-5`}
        >
          <p>Please Select Some Products!</p>
          <button
            disabled={false}
            onClick={handlePrevStep}
            className="btn w-full md:btn-wide btn-primary"
          >
            Previous
          </button>
          <Button text={"Go To Cart"} handler={() => router.push("/cart")} />
        </div>
      )}
    </div>
  );
}
