"use client";
import Button from "@/Shared/Button";
import React, { useState } from "react";
import Quantity from "./Quantity";
import { useAuthContext } from "@/Context/ProjectProvider";
import { postCart, updateQuantity } from "@/apis/carts";
import toast from "react-hot-toast";
import CustomToaster from "@/Shared/CustomToaster";
import { errorHandler } from "@/Utils/errorHandler";

const ButtonWrapper = ({ text, id }) => {
  const [quantity, setQuantity] = useState(1);

  const { user } = useAuthContext();
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
