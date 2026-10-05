"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/components/ui/buttons/Button";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useAddToCartMutation } from "@/redux/apis/cartApis";
import { openCartDrawer } from "@/redux/features/cartSlice";
import Quantity from "./Quantity";

const ButtonWrapper = ({ text, id }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [addToCart, addedResult] = useAddToCartMutation();

  // HANDLE ADD TO CART
  const handleAddToCart = async () => {
    if (!user) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Please sign in to add items to your shopping bag"
        />
      ));
      return;
    }

    if (user.role !== "customer") {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Shopping bag is only available for customer accounts"
        />
      ));
      return;
    }

    try {
      const res = await addToCart({
        product_id: id,
        quantity: quantity,
        user_id: user?.id,
      }).unwrap();

      if (res?.success) {
        dispatch(openCartDrawer());
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Product added to shopping bag"
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
    }
  };

  return (
    <>
      <Quantity setQuantity={setQuantity} quantity={quantity} />
      <Button
        text={text}
        onClick={handleAddToCart}
        isLoading={addedResult.isLoading}
      />
    </>
  );
};

export default ButtonWrapper;
