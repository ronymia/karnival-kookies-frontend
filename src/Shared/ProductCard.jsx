"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "./Button";
import "./sharedAnimation.css";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import { useRouter } from "next/navigation";
import { postCart, updateQuantity } from "@/apis/carts";
import { useAuthContext } from "@/Context/ProjectProvider";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import CustomToaster from "./CustomToaster";
import { errorHandler } from "@/Utils/errorHandler";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuthContext();
  const [quantity, setQuantity] = useState(1);

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

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    postCart({ productId: product?.id, quantity: quantity, email: user?.email })
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
      });
  };
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
            product?.images?.length > 0 && product?.images[0]?.file,
            "Products"
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
            isLoading={isAddingToCart}
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
              product?.discountPrice ? "text-base-200" : "text-primary"
            }`}
          >
            ${product?.regularPrice}
          </p>
          {product?.discountPrice && (
            <p className={`text-red-500`}>${product?.discountPrice}</p>
          )}
        </div>
      </motion.div>
      {product?.discountPrice && (
        <div
          className={`bg-red-500 w-10 h-10 rounded-full text-base-300 font-medium absolute top-3 right-3 flex justify-center items-center text-[12px]`}
        >
          <p>Sale</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
