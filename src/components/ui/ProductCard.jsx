"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import "../../shared/sharedAnimation.css";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  useAddToFavoriteMutation,
  useRemoveFromFavoriteMutation,
} from "@/redux/apis/favoriteProductApis";
import { useSelector } from "react-redux";
import { useAddToCartMutation } from "@/redux/apis/cartApis";
import CustomToaster from "./toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import Button from "./buttons/Button";
import Image from "next/image";
import useDeviceWidth from "@/hooks/useDeviceWidth";

export default function ProductCard({ product }) {
  // GET DIV WITH
  const innerWidth = useDeviceWidth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, addedResult] = useAddToCartMutation();

  // HANDLE ADD TO CARD
  const handleAddToCart = async () => {
    await addToCart({
      product_id: product?.id,
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

  // console.log({ first: product?.images });

  const [addToFavorite, addResult] = useAddToFavoriteMutation();
  const [removeFromFavorite, removeResult] = useRemoveFromFavoriteMutation();

  const handleAddToFavorite = async () => {
    try {
      const result = await addToFavorite({
        user_id: user?.id,
        product_id: product?.id,
      }).unwrap();

      console.log({ result });

      if (result.success) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Product added to Favorite successfully`}
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
    }
  };
  const handleRemoveFavorite = async () => {
    try {
      const result = await removeFromFavorite({
        user_id: user?.id,
        product_id: product?.id,
      }).unwrap();

      console.log({ result });

      if (result.success) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Product remove to Favorite successfully`}
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
    }
  };
  /* **********************************************
                            UI RENDER
    ************************************************************/
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative image-hover cursor-pointer "
    >
      {/* <================ PRODUCT IMAGE ====================> */}
      <div
        onClick={() => router.push(`/products/${product?.id}`)}
        className="relative w-full h-[400px] overflow-hidden rotating-background"
      >
        <Image
          width={400}
          height={400}
          className="jump-image object-cover w-full h-auto"
          src={getFullImageLink(
            product?.images?.length > 0 && product?.images[0]
          )}
          alt={product?.name}
          priority
        />
      </div>

      {/* <================ ADD BUTTON =================> */}
      <motion.div
        animate={
          innerWidth > 768 ? (isHovered ? { opacity: 1 } : { opacity: 0 }) : ""
        }
        className="my-5 flex flex-col justify-center items-center transition-all cart-button"
      >
        <div className={`z-10`}>
          <Button
            type={`button`}
            text={"Add to cart"}
            handler={handleAddToCart}
            isLoading={addedResult.isLoading}
          />
        </div>
      </motion.div>

      {/* <====================== PRODUCT DETAILS ====================> */}
      <motion.div
        onClick={() => router.push(`/products/${product?.id}`)}
        // initial={{ y: -100 }}
        animate={innerWidth > 768 ? (isHovered ? { y: 0 } : { y: -70 }) : ""}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center"
      >
        <p className="text-[20px] font-bold hover:text-primary transition-all">
          {product?.name}
        </p>
        <div className="flex justify-center items-center gap-2">
          <p
            className={` ${
              product?.is_discount_enable === 1
                ? "text-base-200 line-through text-lg"
                : "text-primary text-2xl"
            }`}
          >
            ${product?.price}
          </p>
          {product?.is_discount_enable === 1 && (
            <p className={`text-2xl text-red-500`}>
              ${parseFloat(product?.net_price).toFixed(2)}
            </p>
          )}
        </div>
      </motion.div>

      {/* DISCOUNT */}
      {product?.is_discount_enable === 1 && (
        <div
          className={`bg-red-500 w-12 h-12 rounded-full text-base-300 font-medium absolute top-3 left-3 flex flex-col justify-center items-center text-base `}
        >
          <>
            {product?.discount_type === "fixed" ? (
              <>
                <span>${parseInt(product?.discount_value)}</span>
                {/* <span>off</span> */}
              </>
            ) : (
              <>
                <span>{parseInt(product?.discount_value)}%</span>
                {/* <span>off</span> */}
              </>
            )}
          </>
        </div>
      )}

      {/* FAVORITE PRODUCT */}
      <motion.div
        animate={
          innerWidth > 768 ? (isHovered ? { opacity: 1 } : { opacity: 0 }) : ""
        }
        onClick={(event) => event.stopPropagation()}
        className="flex flex-col gap-1 absolute top-1 right-1 z-10 hover:text-gray-700"
      >
        <FaEye
          size={34}
          title="Quick View"
          className="text-gray-300 bg-primary p-1 rounded hover:bg-primary-content hover:text-primary"
        />
        {product?.favorite_users?.includes(user?.id) ? (
          <MdFavorite
            size={34}
            title="Add to Wishlist"
            onClick={handleRemoveFavorite}
            className="text-red-500 bg-primary p-1 rounded hover:bg-primary-content hover:text-primary"
          />
        ) : (
          <MdFavoriteBorder
            size={34}
            title="Add to Wishlist"
            onClick={handleAddToFavorite}
            className="text-gray-300 bg-primary p-1 rounded hover:bg-primary-content hover:text-primary"
          />
        )}
      </motion.div>
    </div>
  );
}
