"use client";

import { getFullImageLink } from "@/utils/getFullImageLink";
import { useState } from "react";
import Swal from "sweetalert2";
import { BsTrash } from "react-icons/bs";
import { errorHandler } from "@/helpers/errorHandler";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addItems, removeItems } from "@/redux/features/cartSlice";
import {
  useRemoveFromCartMutation,
  useUpdateQuantityOfCartProductMutation,
} from "@/redux/apis/cartApis";

export default function CartItemsCard({ item: cartItem }) {
  const { selectedItems } = useSelector((state) => state.cart);
  const appDispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(cartItem?.quantity);
  const [updateQuantityOfCartProduct] =
    useUpdateQuantityOfCartProductMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  // HANDLE DELETE CART
  const handleDeleteCart = async (id) => {
    await removeFromCart(id)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          Swal.fire({
            title: "Removed",
            text: "Product has been remove from cart.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  //   HANDLE CHECKED
  const handleChecked = (e, item) => {
    const { checked } = e.target;
    if (checked) {
      appDispatch(addItems(item));
    } else {
      appDispatch(removeItems(item));
    }
  };

  const handleQuantityPlus = async (data) => {
    // Calculate new quantity before updating state
    const newQuantity = quantity + 1;

    // UPDATE QUANTITY IN DATABASE
    await updateQuantityOfCartProduct({
      exists: data,
      quantity: newQuantity,
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // Update local state
          setQuantity(newQuantity);
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };
  const handleQuantityMinus = async (data) => {
    // Calculate new quantity before updating state
    const newQuantity = quantity - 1;

    // UPDATE QUANTITY IN DATABASE
    await updateQuantityOfCartProduct({
      exists: data,
      quantity: newQuantity,
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // Update local state
          setQuantity(newQuantity);
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };
  return (
    <div
      className={`flex items-center gap-2 sm:gap-5 shadow-xl max-w-[800px] w-full p-1 sm:px-4 sm:py-2 rounded-[5px] relative`}
      key={cartItem?.id}
    >
      {/* CHECKBOX */}
      <input
        checked={selectedItems?.map((item) => item?.id)?.includes(cartItem?.id)}
        onChange={(e) => handleChecked(e, cartItem)}
        className={`checkbox checkbox-primary`}
        type="checkbox"
      />
      {/* PRODUCT IMAGE */}
      <Image
        width={100}
        height={100}
        className={`min-w-[50px] w-[100px]`}
        src={getFullImageLink(cartItem?.product?.images[currentImageIndex])}
        alt={cartItem?.product?.name}
      />
      {/* PRODUCT INFO */}
      <div className={`flex flex-col justify-between gap-5 flex-grow`}>
        <div className={` space-y-1`}>
          <h3 className={`text-[12px] sm:text-base font-semibold mr-3`}>
            {cartItem?.product?.name}
          </h3>
          <h3 className={`text-primary font-[20px]`}>
            ${" "}
            {cartItem?.product?.net_price
              ? cartItem?.product?.net_price
              : cartItem?.product?.price}
          </h3>
        </div>

        <div
          className={`flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between`}
        >
          {/* IMAGE SLIDER */}
          <div className={`mb-1 mx-2 flex flex-wrap gap-2`}>
            {cartItem?.product?.images?.map((image, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  currentImageIndex === i ? "border-2 border-btn-primary" : ""
                }`}
              >
                <div
                  className={`h-5 w-5 m-[2px] rounded-full overflow-hidden `}
                >
                  <Image
                    width={25}
                    height={25}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-full h-auto`}
                    src={getFullImageLink(image)}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ADD AND REMOVE QUANTITY */}
          <div className={`flex items-center`}>
            <button
              disabled={
                quantity >= 99 ||
                selectedItems?.map((item) => item?.id)?.includes(cartItem?.id)
              }
              onClick={() => quantity < 99 && handleQuantityPlus(cartItem)}
              className={`mr-2 px-1 ${
                quantity >= 99 ||
                selectedItems?.map((item) => item?.id)?.includes(cartItem?.id)
                  ? ""
                  : "transition-transform hover:scale-105 focus:scale-95 duration-75 bg-secondary "
              } font-bold rounded-[5px]`}
            >
              +
            </button>
            <p className={`mr-2 px-1`}>{quantity}</p>
            <button
              disabled={
                quantity <= 1 ||
                selectedItems?.map((item) => item?.id)?.includes(cartItem?.id)
              }
              onClick={() => quantity > 1 && handleQuantityMinus(cartItem)}
              className={`mr-2 px-1 ${
                quantity <= 1 ||
                selectedItems?.map((item) => item?.id)?.includes(cartItem?.id)
                  ? ""
                  : "transition-transform hover:scale-105 focus:scale-95 duration-75 bg-secondary "
              }   font-bold rounded-[5px]`}
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* DELETE ITEM */}
      <div
        onClick={() => handleDeleteCart(cartItem?.id)}
        className={` absolute top-0 right-0 p-1 text-2xl font-bold text-error transition-all rounded-[5px] hover:scale-105 active:scale-95`}
      >
        <BsTrash />
      </div>
    </div>
  );
}
