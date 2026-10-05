"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { openCartDrawer } from "@/redux/features/cartSlice";
import toast from "react-hot-toast";
import { FiEye, FiShoppingBag, FiCheck } from "react-icons/fi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import PropTypes from "prop-types";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { errorHandler } from "@/helpers/errorHandler";
import CustomToaster from "../toaster/CustomToaster";
import ButtonSpinner from "../buttons/ButtonSpinner";
import { useAddToCartMutation } from "@/redux/apis/cartApis";
import {
  useAddToFavoriteMutation,
  useRemoveFromFavoriteMutation,
} from "@/redux/apis/favoriteProductApis";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const [addToCart, { isLoading: isCartLoading }] = useAddToCartMutation();
  const [addToFavorite, { isLoading: isFavAddLoading }] =
    useAddToFavoriteMutation();
  const [removeFromFavorite, { isLoading: isFavRemoveLoading }] =
    useRemoveFromFavoriteMutation();

  const [isAdded, setIsAdded] = useState(false);

  const isFavorite =
    user?.id && Array.isArray(product?.favorite_users)
      ? product.favorite_users.includes(user.id)
      : false;

  // Handle Add to Cart
  const handleAddToCart = async (e) => {
    e.stopPropagation();

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
        product_id: product?.id,
        quantity: 1,
        user_id: user?.id,
      }).unwrap();

      if (res?.success) {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1800);
        dispatch(openCartDrawer());
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text={`${product?.name || "Product"} added to bag`}
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user?.id) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text="Please sign in to save favorites"
        />
      ));
      return;
    }

    try {
      if (isFavorite) {
        const res = await removeFromFavorite({
          user_id: user.id,
          product_id: product.id,
        }).unwrap();
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster t={t} type="success" text="Removed from wishlist" />
          ));
        }
      } else {
        const res = await addToFavorite({
          user_id: user.id,
          product_id: product.id,
        }).unwrap();
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster t={t} type="success" text="Saved to wishlist" />
          ));
        }
      }
    } catch (err) {
      errorHandler({ err });
    }
  };

  const isDiscount = product?.is_discount_enable === 1;
  const originalPrice = Number.parseFloat(product?.price || 0).toFixed(2);
  const netPrice = isDiscount
    ? Number.parseFloat(product?.net_price || 0).toFixed(2)
    : originalPrice;

  const imageUrl = getFullImageLink(
    product?.images?.length > 0 ? product.images[0] : null,
  );

  const renderAddToCartContent = () => {
    if (isCartLoading) {
      return (
        <>
          <ButtonSpinner />
          <span>Adding...</span>
        </>
      );
    }
    if (isAdded) {
      return (
        <>
          <FiCheck className="text-base" />
          <span>Added to Cart</span>
        </>
      );
    }
    return (
      <>
        <FiShoppingBag className="text-base" />
        <span>Add to Cart</span>
      </>
    );
  };

  return (
    <article className="group relative bg-[#161311]/85 hover:bg-[#1c1815] backdrop-blur-md border border-primary/20 hover:border-primary/55 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
      {/* <================ TOP IMAGE CONTAINER =================> */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 mb-3.5">
        <Link
          href={product?.id ? `/shop-product/${product.id}` : "#"}
          aria-label={product?.name || "View product details"}
          className="block relative w-full h-full"
        >
          <Image
            src={imageUrl || "/noDataFound.svg"}
            alt={product?.name || "Karnival Kookies Product"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* IMAGE BOTTOM VIGNETTE */}
          <div
            className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />
        </Link>

        {/* DISCOUNT BADGE */}
        {isDiscount && (
          <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-linear-to-r from-red-600 to-rose-500 text-white text-[11px] font-bold tracking-wider shadow-md shadow-red-950/60 uppercase pointer-events-none">
            {product?.discount_type === "fixed"
              ? `$${Number.parseInt(product?.discount_value, 10)} OFF`
              : `${Number.parseInt(product?.discount_value, 10)}% OFF`}
          </div>
        )}

        {/* FLOATING ACTION ICONS (TOP RIGHT) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-2">
          {/* WISHLIST BUTTON */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={isFavAddLoading || isFavRemoveLoading}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 hover:border-primary/60 text-white flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md cursor-pointer group/fav"
          >
            {isFavorite ? (
              <MdFavorite className="text-red-500 text-lg transition-transform group-hover/fav:scale-110" />
            ) : (
              <MdFavoriteBorder className="text-neutral-300 group-hover/fav:text-primary text-lg transition-transform group-hover/fav:scale-110" />
            )}
          </button>

          {/* QUICK VIEW BUTTON */}
          <Link
            href={product?.id ? `/shop-product/${product.id}` : "#"}
            aria-label={`Quick View ${product?.name || "product"}`}
            className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 hover:border-primary/60 text-neutral-300 hover:text-primary flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md cursor-pointer group/view opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          >
            <FiEye className="text-lg transition-transform group-hover/view:scale-110" />
          </Link>
        </div>
      </div>

      {/* <================ PRODUCT INFO =================> */}
      <div className="flex flex-col gap-2 grow justify-between">
        {/* TITLE & CATEGORY */}
        <div>
          {product?.category?.name && (
            <span className="text-[10px] uppercase tracking-[0.14em] text-primary/80 font-medium block mb-0.5">
              {product.category.name}
            </span>
          )}
          <h3 className="font-sans text-sm sm:text-base text-white font-semibold group-hover:text-primary transition-colors line-clamp-1">
            <Link
              href={product?.id ? `/shop-product/${product.id}` : "#"}
              className="focus:outline-none focus:underline"
            >
              {product?.name}
            </Link>
          </h3>
        </div>

        {/* PRICING */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base sm:text-lg font-bold font-sans tracking-tight text-primary">
            ${netPrice}
          </span>
          {isDiscount && (
            <span className="text-xs sm:text-sm font-normal text-neutral-400 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* ADD TO CART ACTION BUTTON */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isCartLoading}
          className={`w-full mt-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all duration-200 active:scale-95 cursor-pointer ${
            isAdded
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-primary/10 hover:bg-primary text-primary hover:text-black border-primary/30 hover:border-primary shadow-sm hover:shadow-md hover:shadow-primary/20"
          }`}
        >
          {renderAddToCartContent()}
        </button>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    net_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    images: PropTypes.arrayOf(PropTypes.string),
    is_discount_enable: PropTypes.number,
    discount_type: PropTypes.string,
    discount_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    favorite_users: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};
