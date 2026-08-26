import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useCartCheckoutMutation } from "@/redux/apis/cartApis";
import { resetCart } from "@/redux/features/cartSlice";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

function PaymentForm({ formData, handlePrevStep }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const { selectedItems } = useSelector((state) => state.cart);
  const appDispatch = useDispatch();
  const [cartCheckout, cartCheckoutResult] = useCartCheckoutMutation();

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
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage({ success: "Payment Successful" });
      setIsProcessing(false);

      // PAYMENT INFO
      const paymentInfo = {
        order_id: "",
        transaction_id: paymentIntent?.id || "",
        amount: paymentIntent?.amount || 0,
        method: "stripe",
        status: "paid",
      };

      // CREATE ORDER
      const cartCheckoutData = {
        user_id: user?.id,
        order_items: selectedItems?.map((cartProduct) => ({
          product_id: cartProduct?.product_id,
          quantity: cartProduct?.quantity,
          price: cartProduct?.product?.is_discount_enable
            ? cartProduct?.product?.net_price * cartProduct?.quantity
            : cartProduct?.product?.price * cartProduct?.quantity,
        })),
        shipping_info: { ...formData?.shipping_info },
        payment: paymentInfo,
      };

      // CHECK OUT CART
      await cartCheckout(cartCheckoutData)
        .unwrap()
        .then((resp) => {
          // IF SUCCESS
          if (resp?.success) {
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"success"}
                text={`Order Placed Successfully`}
              />
            ));

            // CLEAR CART
            appDispatch(resetCart?.());
            // REDIRECT
            router.push("/dashboard/order-history");
          }
        })
        .catch((err) => {
          errorHandler({ err });
        });
    } else {
      setMessage({ error: "Unexpected error" });
    }
    setIsProcessing(false);
  };

  /* ===================================================
  
  ==============================================================*/
  if (cartCheckoutResult?.isLoading) {
    return <CustomLoading />;
  }
  return (
    <form className={`space-y-5`} id="payment-form" onSubmit={handlePayment}>
      {/* PAYMENT FORM */}
      <PaymentElement />

      {/* SUCCESS */}
      {message?.success && (
        <>
          <p className="text-green-500 font-bold">{message?.success}</p>
          <button
            disabled={false}
            onClick={handlePrevStep}
            className="btn w-full md:btn-wide btn-primary"
          >
            Previous
          </button>
        </>
      )}
      {/* ERROR MESSAGE */}
      {message?.error && (
        <p className="text-red-500 font-bold">{message?.error}</p>
      )}

      {/* PAYMENT BUTTON */}
      <div className={`flex justify-center `}>
        <button
          type="submit"
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
}

export default PaymentForm;
