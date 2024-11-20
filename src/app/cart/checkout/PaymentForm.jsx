import { deleteCartItems, postCheckout } from "@/apis/carts";
import { useAuthContext, useCartContext } from "@/Context/ProjectProvider";
import Button from "@/Shared/Button";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomToaster from "@/Shared/CustomToaster";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowRoundForward } from "react-icons/io";

const PaymentForm = ({ formData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthContext();
  const { checkoutTotal, selectedItems } = useCartContext();
  const router = useRouter();

  console.log({ selectedItems });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cart/checkout`,
      },
      redirect: "if_required",
    });
    if (error) {
      setMessage({ error: error?.message });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage({ success: "Payment Successful" });

      const checkout = {
        userName: user?.name,
        userEmail: user?.email,
        checkoutInfo: { ...formData?.step1 },
        paymentInfo: selectedItems?.map((item) => ({
          productId: item?.productId,
          quantity: item?.quantity,
        })),
        paymentMethod: "stripe",
        totalPayableAmount: checkoutTotal,
        status: "pending",
        isPaid: true,
      };
      postCheckout(checkout)
        .then(async (res) => {
          console.log({ resFromCheckout: res });
          if (res?.success) {
            deleteCartItems({
              ids: selectedItems?.map((item) => item?.id),
            }).then((res) => {
              console.log({ resFromDelete: res });
              if (res?.success) {
                toast.custom((t) => (
                  <CustomToaster
                    t={t}
                    type={"success"}
                    text={`Order Placed Successfully`}
                  />
                ));
                router.push("/dashboard/order-history");
              }
            });
          }
        })
        .catch((err) => {
          console.log({ err });
        });
    } else {
      setMessage({ error: "Unexpected error" });
    }
    setIsProcessing(false);
  };
  return (
    <form className={`space-y-5`} id="payment-form" onSubmit={handlePayment}>
      <PaymentElement />

      {message?.success && (
        <p className="text-green-500 font-bold">{message?.success}</p>
      )}
      {message?.error && (
        <p className="text-red-500 font-bold">{message?.error}</p>
      )}
      <div className={`flex justify-center `}>
        <button
          disabled={isProcessing}
          id="submit"
          className={`${
            isProcessing ? "bg-primary px-6 py-2" : "bg-base-300 px-3 py-2"
          } text-primary  border border-primary rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]`}
        >
          {isProcessing ? (
            <ButtonSpinner />
          ) : (
            <>
              <p className="group-hover:text-base-300 transition-[color] duration-700">
                Pay
              </p>
              <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2  transition-transform duration-300" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
