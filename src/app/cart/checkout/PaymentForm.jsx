import { deleteCartItems, postCheckout } from "@/apis/carts";
import { useOrderCheckInMutation } from "@/redux/apis/orderApis";
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
import { useSelector } from "react-redux";

const PaymentForm = ({ state }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCheckIn, checkInResult] = useOrderCheckInMutation();
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const { totalPrice: total_amount, selectedItems } = useSelector(
    (state) => state.cart
  );
  const router = useRouter();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    // GET PAYMENT INTENT
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cart/checkout`,
      },
      redirect: "if_required",
    });

    // GO FOR PAYMENT
    if (error) {
      setMessage({ error: error?.message });
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage({ success: "Payment Successful" });

      const checkout = {
        userName: user?.name,
        userEmail: user?.email,
        checkoutInfo: { ...state?.shipping_info },
        paymentInfo: selectedItems?.map((item) => ({
          productId: item?.productId,
          quantity: item?.quantity,
        })),
        paymentMethod: "stripe",
        totalPayableAmount: total_amount,
        status: "pending",
        isPaid: true,
      };
      const resp = await orderCheckIn({
        ...state,
        payment_method: "stripe",
        user_id: user?.id,
        order_items: selectedItems,
        total_amount: total_amount,
        payment_info: {
          payment_method: "card",
          payment_status: "paid",
        },
      }).unwrap();
      console.log({ resp });
      // IF SUCCESS
      if (resp?.success) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Order Placed Successfully`}
          />
        ));
        router.push("/dashboard/order-history");
      }
    } else {
      setMessage({ error: "Unexpected error" });
    }
    setIsProcessing(false);
  };

  /* ===================================================
  
  ==============================================================*/
  return (
    <form className={`space-y-5`} id="payment-form" onSubmit={handlePayment}>
      {/* PAYMENT FORM */}
      <PaymentElement />

      {/* SUCCESS */}
      {message?.success && (
        <p className="text-green-500 font-bold">{message?.success}</p>
      )}
      {/* ERROR MESSAGE */}
      {message?.error && (
        <p className="text-red-500 font-bold">{message?.error}</p>
      )}

      {/* PAYMENT BUTTON */}
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
