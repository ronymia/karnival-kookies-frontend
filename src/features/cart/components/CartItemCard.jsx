"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { getFullImageLink } from "@/utils/getFullImageLink";
import { errorHandler } from "@/helpers/errorHandler";
import { useDispatch, useSelector } from "react-redux";
import { addItems, removeItems } from "@/redux/features/cartSlice";
import { useRemoveFromCart, useUpdateCartQuantity } from "../hooks";
import { CartService } from "../services";
import { FiTrash2, FiPlus, FiMinus, FiCheck } from "react-icons/fi";

export default function CartItemCard({ item: cartItem }) {
  const { selectedItems } = useSelector((state) => state.cart);
  const appDispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);

  const [updateQuantityMutation] = useUpdateCartQuantity();
  const [removeFromCartMutation, { isLoading: isDeleting }] =
    useRemoveFromCart();

  const product = cartItem?.product || {};
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/images/cookie-placeholder.jpg"];

  const currentImage = images[currentImageIndex] || images[0];
  const unitPrice = CartService.getItemUnitPrice(cartItem);
  const originalPrice = product.regular_price || product.price;
  const hasDiscount = Boolean(
    product.is_discount_enable && originalPrice > unitPrice,
  );
  const lineTotal = unitPrice * quantity;

  const isSelected = Boolean(
    selectedItems?.some((item) => item?.id === cartItem?.id),
  );

  // Toggle selection
  const handleToggleSelect = () => {
    if (isSelected) {
      appDispatch(removeItems(cartItem));
    } else {
      appDispatch(addItems(cartItem));
    }
  };

  // Quantity updates
  const handleUpdateQuantity = async (newQty) => {
    if (newQty < 1 || newQty > 99 || isUpdatingQty) return;

    setIsUpdatingQty(true);
    try {
      const res = await updateQuantityMutation({
        exists: cartItem,
        quantity: newQty,
      }).unwrap();

      if (res?.success) {
        setQuantity(newQty);
        if (isSelected) {
          appDispatch(removeItems(cartItem));
          appDispatch(addItems({ ...cartItem, quantity: newQty }));
        }
      }
    } catch (err) {
      errorHandler({ err });
    } finally {
      setIsUpdatingQty(false);
    }
  };

  // Delete cart item
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Remove item?",
      text: `Remove "${product.name || "this item"}" from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c98d53",
      cancelButtonColor: "#27272a",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      background: "#181411",
      color: "#ffffff",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await removeFromCartMutation(cartItem.id).unwrap();
      if (res?.success) {
        if (isSelected) {
          appDispatch(removeItems(cartItem));
        }
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Item removed from shopping cart"
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
    }
  };

  return (
    <div
      className={`group rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isSelected
          ? "bg-[#161210] border-primary/40 shadow-lg shadow-black/30"
          : "bg-[#120f0d] border-white/10 hover:border-white/20"
      }`}
    >
      {/* LEFT SECTION: CHECKBOX, THUMBNAIL & PRODUCT INFO */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* CHECKBOX */}
        <button
          type="button"
          onClick={handleToggleSelect}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isSelected
              ? "bg-primary border-primary text-black shadow-md shadow-primary/25"
              : "border-white/20 hover:border-primary/50 bg-black/40 text-transparent"
          }`}
          aria-label={isSelected ? "Deselect item" : "Select item for checkout"}
        >
          <FiCheck className="text-sm stroke-[3]" />
        </button>

        {/* IMAGE & GALLERY THUMBNAILS */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
            <Image
              src={getFullImageLink(currentImage)}
              alt={product.name || "Bakery product"}
              fill
              sizes="80px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-1 max-w-[80px] overflow-x-auto py-0.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-3.5 h-3.5 rounded-full overflow-hidden border transition-all shrink-0 ${
                    currentImageIndex === i
                      ? "border-primary scale-110 ring-1 ring-primary/40"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={getFullImageLink(img)}
                    alt=""
                    fill
                    sizes="14px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAME & UNIT PRICE */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/shop-product/${product.id || cartItem.product_id}`}
            className="font-serif text-base sm:text-lg font-medium text-white hover:text-primary transition-colors leading-snug line-clamp-1 block"
          >
            {product.name || "Artisanal Gourmet Treat"}
          </Link>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-primary font-bold text-sm sm:text-base">
              ${unitPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-500 line-through font-mono">
                ${Number(originalPrice).toFixed(2)}
              </span>
            )}
            <span className="text-[11px] text-neutral-400">/ each</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: QUANTITY, LINE TOTAL & DELETE ACTION */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
        {/* QUANTITY SELECTOR */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            disabled={quantity <= 1 || isUpdatingQty}
            onClick={() => handleUpdateQuantity(quantity - 1)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Decrease quantity"
          >
            <FiMinus className="text-xs" />
          </button>

          <span className="w-8 text-center font-mono text-xs sm:text-sm font-semibold text-white">
            {quantity}
          </span>

          <button
            type="button"
            disabled={quantity >= 99 || isUpdatingQty}
            onClick={() => handleUpdateQuantity(quantity + 1)}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Increase quantity"
          >
            <FiPlus className="text-xs" />
          </button>
        </div>

        {/* LINE TOTAL */}
        <div className="text-right min-w-[72px]">
          <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">
            Total
          </span>
          <span className="font-mono font-bold text-white text-sm sm:text-base">
            ${lineTotal.toFixed(2)}
          </span>
        </div>

        {/* TRASH REMOVE BUTTON */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Remove item"
          className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
        >
          <FiTrash2 className="text-base" />
        </button>
      </div>
    </div>
  );
}

CartItemCard.propTypes = {
  item: PropTypes.object.isRequired,
};
