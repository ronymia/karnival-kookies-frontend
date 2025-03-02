"use client";
import Button from "@/components/UI/buttons/Button";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useAddToCartMutation } from "@/redux/apis/cartApis";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Quantity from "./Quantity";

const ButtonWrapper = ({ text, id }) => {
  const [quantity, setQuantity] = useState(1);

  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const [addToCart, addedResult] = useAddToCartMutation();

  // HANDLE ADD TO CARD
  const handleAddToCart = async () => {
    await addToCart({
      product_id: id,
      quantity: quantity,
      user_id: user?.id,
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Product added to the cart successfully`}
            />
          ));
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  return (
    <>
      <Quantity setQuantity={setQuantity} quantity={quantity} />
      <Button
        text={text}
        handler={handleAddToCart}
        isLoading={addedResult.isLoading}
      />
    </>
  );
};

export default ButtonWrapper;
