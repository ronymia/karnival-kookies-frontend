"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../../Shared/sharedAnimation.css";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import { useRouter } from "next/navigation";
import { updateQuantity } from "@/apis/carts";
import toast from "react-hot-toast";
import CustomToaster from "@/Shared/CustomToaster";
import { BsEye } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Button from "@/Shared/Button";
import {
  useAddToFavoriteMutation,
  useRemoveFromFavoriteMutation,
} from "@/redux/apis/favoriteProductApis";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { useSelector } from "react-redux";
import { useAddToCartMutation } from "@/redux/apis/cartApis";

export default function ProductCard({ product }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  // USER FROM REDUX STORE
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, addedResult] = useAddToCartMutation();

  // GET DIV WITH
  const useDeviceWidth = () => {
    const [width, setWidth] = useState(() =>
      typeof window !== "undefined" ? window.innerWidth : 0
    );

    useEffect(() => {
      // Only add event listener in the browser
      if (typeof window !== "undefined") {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }
    }, []);

    return width;
  };

  const handleAddToCart = async () => {
    await addToCart({
      product_id: product?.id,
      quantity: quantity,
      email: user?.email,
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
        } else {
          // const info = {
          //   exists: res?.exists,
          //   quantity: res?.exists?.quantity + res?.quantity,
          // };
          // updateQuantity(info)
          //   .then((res) => {
          //     if (res?.success) {
          //       toast.custom((t) => (
          //         <CustomToaster
          //           t={t}
          //           type={"success"}
          //           text={`Product already in the cart but we increased the quantity. You can decrease it from cart`}
          //         />
          //       ));
          //       setIsAddingToCart(false);
          //     }
          //   })
          //   .catch((err) => {
          //     setIsAddingToCart(false);
          //     errorHandler({ err, setLoading: setIsAddingToCart });
          //   });
        }
      })
      .catch((err) => {
        errorHandlerV2({ err });
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
      errorHandlerV2({ err });
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
      errorHandlerV2({ err });
    }
  };
  /* **********************************************
                            UI RENDER
    ************************************************************/
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative image-hover cursor-pointer"
    >
      <div
        onClick={() => router.push(`/products/${product?.id}`)}
        // style={{ backgroundImage: `url(/dots.png)` }}
        className="overflow-hidden rotating-background"
      >
        <img
          className="jump-image"
          src={getFullImageLink(
            product?.images?.length > 0 && product?.images[0]
          )}
          alt={product?.name}
        />
      </div>
      <motion.div
        animate={
          useDeviceWidth() > 768
            ? isHovered
              ? { opacity: 1 }
              : { opacity: 0 }
            : ""
        }
        className="my-5 flex flex-col justify-center items-center transition-all cart-button"
      >
        <div className={`z-10`}>
          <Button
            text={"Add to cart"}
            handler={handleAddToCart}
            isLoading={addedResult.isLoading}
          />
        </div>
      </motion.div>
      <motion.div
        onClick={() => router.push(`/products/${product?.id}`)}
        // initial={{ y: -100 }}
        animate={
          useDeviceWidth() > 768 ? (isHovered ? { y: 0 } : { y: -70 }) : ""
        }
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center"
      >
        <p className="text-[20px] font-bold hover:text-primary transition-all">
          {product?.name}
        </p>
        <div className="flex justify-center items-center gap-2">
          <p
            className={`${
              product?.discount_Price ? "text-base-200" : "text-primary"
            }`}
          >
            ${product?.regular_Price}
          </p>
          {product?.discount_Price && (
            <p className={`text-red-500`}>${product?.discount_Price}</p>
          )}
        </div>
      </motion.div>

      {/* DISCOUNT */}
      {product?.discount_price && (
        <div
          className={`bg-red-500 w-10 h-10 rounded-full text-base-300 font-medium absolute top-3 left-3 flex justify-center items-center text-[12px]`}
        >
          <p>Sale</p>
        </div>
      )}

      {/* FAVORITE PRODUCT */}
      <motion.div
        animate={
          useDeviceWidth() > 768
            ? isHovered
              ? { opacity: 1 }
              : { opacity: 0 }
            : ""
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
