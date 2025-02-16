"use client";
import React, { useState } from "react";
import Quantity from "./Quantity";
import { postCart, updateQuantity } from "@/apis/carts";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import Button from "@/components/UI/buttons/Button";

const ButtonWrapper = ({ text, id }) => {
  const [quantity, setQuantity] = useState(1);

  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    postCart({ productId: id, quantity: quantity, email: user?.email })
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Product added to the cart successfully`}
            />
          ));
          setIsAddingToCart(false);
        } else {
          const info = {
            exists: res?.exists,
            quantity: res?.exists?.quantity + res?.quantity,
          };

          updateQuantity(info)
            .then((res) => {
              if (res?.success) {
                toast.custom((t) => (
                  <CustomToaster
                    t={t}
                    type={"success"}
                    text={`Product already in the cart but we increased the quantity. You can decrease it from cart`}
                  />
                ));
                setQuantity(1);
                setIsAddingToCart(false);
              }
            })
            .catch((err) => {
              setIsAddingToCart(false);
              errorHandler({ err, setLoading: setIsAddingToCart });
            });
        }
      })
      .catch((err) => {
        setIsAddingToCart(false);
        console.log({ err });
      });
  };

  return (
    <>
      <Quantity setQuantity={setQuantity} quantity={quantity} />
      <Button
        text={text}
        handler={handleAddToCart}
        isLoading={isAddingToCart}
      />
    </>
  );
};

export default ButtonWrapper;
