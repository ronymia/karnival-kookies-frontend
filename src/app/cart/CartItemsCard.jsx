"use client";

import CustomToaster from "@/Shared/CustomToaster";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { BsTrash } from "react-icons/bs";
import { deleteCart, updateQuantity } from "@/apis/carts";
import { errorHandler } from "@/Utils/errorHandler";

const CartItemsCard = ({ item, setIsUpdating, handleChecked, checked }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(item?.quantity);

  console.log({ itemFromCard: item });

  // HANDLE DELETE CART
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDeleteCart = (id) => {
    setIsDeleteLoading(true);
    deleteCart({ id })
      .then((res) => {
        if (res?.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Item has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          setIsUpdating(Math.random());
          setIsDeleteLoading(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsDeleteLoading });
      });
  };

  //   HANDLE UPDATE QUANTITY
  const handleUpdateQuantity = (data, mode) => {
    console.log({ dataFromUpQuan: data });
    const info = {
      exists: {
        id: data?.id,
        email: data?.email,
        productId: data?.productId,
        createdAt: data?.createdAt,
      },
      quantity:
        mode === "plus"
          ? quantity + 1
          : mode === "minus"
          ? quantity - 1
          : quantity,
    };

    updateQuantity(info)
      .then((res) => {
        setIsUpdating(Math.random());
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsUpdating });
      });
  };

  const handleQuantityPlus = (data) => {
    setQuantity(quantity + 1);
    handleUpdateQuantity(data, "plus");
  };
  const handleQuantityMinus = (data) => {
    setQuantity(quantity - 1);
    handleUpdateQuantity(data, "minus");
  };
  return (
    <div
      className={`flex items-center gap-2 sm:gap-5 shadow-xl max-w-[800px] w-full p-1 sm:px-4 sm:py-2 rounded-[5px] relative`}
      key={item?.id}
    >
      <input
        checked={checked?.map((i) => i)?.includes(item?.id)}
        onChange={(e) => handleChecked(e, item)}
        className={`checkbox checkbox-primary`}
        type="checkbox"
      />
      <img
        className={`min-w-[50px] w-[100px]`}
        src={getFullImageLink(item?.product?.images[0]?.file, "Products")}
        alt={item?.product?.name}
      />
      <div className={`flex flex-col justify-between gap-5 flex-grow`}>
        <div className={` space-y-1`}>
          <h3 className={`text-[12px] sm:text-base font-semibold mr-3`}>
            {item?.product?.name}
          </h3>
          <h3 className={`text-primary font-[20px]`}>
            ${" "}
            {item?.product?.discountPrice
              ? item?.product?.discountPrice
              : item?.product?.regularPrice}
          </h3>
        </div>
        <div
          className={`flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between`}
        >
          <div className={`mb-1 mx-2 flex flex-wrap gap-2`}>
            {item?.product?.images?.map((image, i) => (
              <div
                key={i}
                className={`rounded-full ${
                  currentImageIndex === i ? "border-2 border-btn-primary" : ""
                }`}
              >
                <div
                  className={`h-5 w-5 m-[2px] rounded-full overflow-hidden `}
                >
                  <img
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-full h-auto`}
                    src={getFullImageLink(image?.file, "Products")}
                    alt=""
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={`flex items-center`}>
            <button
              disabled={quantity >= 99 || checked?.length > 0}
              onClick={() => quantity < 99 && handleQuantityPlus(item)}
              className={`mr-2 px-1 ${
                quantity >= 99 || checked?.length > 0
                  ? ""
                  : "transition-transform hover:scale-105 focus:scale-95 duration-75 bg-secondary "
              } font-bold rounded-[5px]`}
            >
              +
            </button>
            <p className={`mr-2 px-1`}>{quantity}</p>
            <button
              disabled={quantity <= 1 || checked?.length > 0}
              onClick={() => quantity > 1 && handleQuantityMinus(item)}
              className={`mr-2 px-1 ${
                quantity <= 1 || checked?.length > 0
                  ? ""
                  : "transition-transform hover:scale-105 focus:scale-95 duration-75 bg-secondary "
              }   font-bold rounded-[5px]`}
            >
              -
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={() => handleDeleteCart(item?.id)}
        className={`z-[1000] absolute top-0 right-0 p-1 text-2xl font-bold text-error transition-all rounded-[5px] hover:scale-105 active:scale-95`}
      >
        <BsTrash />
      </div>
    </div>
  );
};

export default CartItemsCard;
