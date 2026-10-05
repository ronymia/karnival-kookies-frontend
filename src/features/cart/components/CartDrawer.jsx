"use client";

import { Button } from "@/components/ui/buttons";
import SlideOverDrawer from "@/components/ui/drawer/SlideOverDrawer";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import useAuth from "@/hooks/useAuth";
import {
  addItems,
  closeCartDrawer,
  removeItems,
} from "@/redux/features/cartSlice";
import { getFullImageLink } from "@/utils/getFullImageLink";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiCheck,
  FiCheckSquare,
  FiGift,
  FiLock,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiSquare,
  FiTrash2,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  useCartEvaluation,
  useGetCart,
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "../hooks";
import { CartService } from "../services";
import CouponApplyInput from "./CouponApplyInput";

const FREE_SHIPPING_THRESHOLD = 50;

export default function CartDrawer() {
  const { user, isCustomer } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    isDrawerOpen,
    totalQuantity,
    totalPrice,
    selectedItems,
    appliedCoupon,
    activeCampaign,
    freeItems,
    isFreeShipping,
    campaignDiscount,
  } = useSelector((state) => state.cart || {});

  const { cartItems, isLoading } = useGetCart({
    skip: !isCustomer || !isDrawerOpen,
  });

  const [updateQuantityMutation] = useUpdateCartQuantity();
  const [removeFromCartMutation] = useRemoveFromCart();

  // Real-time Campaign Evaluation on cart items or coupon change (300ms debounced)
  useCartEvaluation({
    cartItems: isCustomer && isDrawerOpen ? cartItems : [],
    couponCode: appliedCoupon?.code,
    userId: user?.id,
  });

  // Guard: Cart Drawer is ONLY accessible and visible to customers
  if (!isCustomer) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleProceedCheckout = () => {
    handleClose();
    router.push("/cart/checkout");
  };

  const handleViewCartPage = () => {
    handleClose();
    router.push("/cart");
  };

  const hasItems = Array.isArray(cartItems) && cartItems.length > 0;
  const currentTotal = totalPrice || 0;
  const discountAmount = CartService.calculateDiscount(
    currentTotal,
    appliedCoupon,
  );
  const effectiveDiscount = Math.max(discountAmount, campaignDiscount || 0);
  const finalTotal = Math.max(0, currentTotal - effectiveDiscount);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - currentTotal,
  );
  const freeShippingProgress = Math.min(
    100,
    (currentTotal / FREE_SHIPPING_THRESHOLD) * 100,
  );

  const allSelected =
    hasItems &&
    cartItems.every((item) =>
      selectedItems?.some((sel) => sel?.id === item?.id),
    );

  const handleToggleSelectAll = () => {
    if (allSelected) {
      cartItems.forEach((item) => dispatch(removeItems(item)));
    } else {
      cartItems.forEach((item) => {
        const isAlreadySelected = selectedItems?.some(
          (sel) => sel?.id === item?.id,
        );
        if (!isAlreadySelected) {
          dispatch(addItems(item));
        }
      });
    }
  };

  const handleToggleItemSelect = (cartItem) => {
    const isSelected = selectedItems?.some((i) => i?.id === cartItem?.id);
    if (isSelected) {
      dispatch(removeItems(cartItem));
    } else {
      dispatch(addItems(cartItem));
    }
  };

  const handleUpdateQty = async (cartItem, newQty) => {
    if (newQty < 1 || newQty > 99) return;
    try {
      const res = await updateQuantityMutation({
        exists: cartItem,
        quantity: newQty,
      }).unwrap();
      if (res?.success) {
        const isSelected = selectedItems?.some((i) => i?.id === cartItem?.id);
        if (isSelected) {
          dispatch(removeItems(cartItem));
          dispatch(addItems({ ...cartItem, quantity: newQty }));
        }
      }
    } catch {
      // Handled in mutation hook
    }
  };

  const handleDeleteItem = async (cartItem) => {
    try {
      const res = await removeFromCartMutation(cartItem.id).unwrap();
      if (res?.success) {
        dispatch(removeItems(cartItem));
      }
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <SlideOverDrawer
      isOpen={Boolean(isDrawerOpen)}
      onClose={handleClose}
      size="md"
      title="Your Shopping Bag"
      subtitle={`${selectedItems?.length || 0} of ${
        cartItems?.length || 0
      } treats selected`}
      className="bg-[#120f0d] text-white"
      headerExtra={
        hasItems && (
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium cursor-pointer"
          >
            {allSelected ? (
              <>
                <FiCheckSquare className="text-sm" />
                <span>Deselect All</span>
              </>
            ) : (
              <>
                <FiSquare className="text-sm" />
                <span>Select All</span>
              </>
            )}
          </button>
        )
      }
      footer={
        hasItems && (
          <div className="space-y-4 w-full">
            {/* PROMO / COUPON INPUT */}
            <CouponApplyInput subtotal={currentTotal} />

            {/* FINANCIAL SUMMARY */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Selected Items Subtotal</span>
                <span className="font-mono font-medium text-white">
                  ${currentTotal.toFixed(2)}
                </span>
              </div>

              {effectiveDiscount > 0 && (
                <div className="flex justify-between items-center text-primary">
                  <span>
                    Promotion (
                    {activeCampaign?.title || appliedCoupon?.code || "Offer"})
                  </span>
                  <span className="font-mono font-semibold">
                    -${effectiveDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-neutral-400">
                <span>Delivery Charge (Free)</span>
                <span className="font-mono text-emerald-400 font-semibold">
                  $0.00
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-white">
                  Total Amount
                </span>
                <span className="font-mono text-2xl font-bold text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CHECKOUT CTA */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                disabled={!totalQuantity || totalQuantity <= 0}
                onClick={handleProceedCheckout}
                text="Proceed to Checkout"
                endIcon={FiArrowRight}
                className="w-full shadow-lg shadow-primary/20 py-3.5"
              />

              <button
                type="button"
                onClick={handleViewCartPage}
                className="w-full py-2 text-center text-xs font-medium text-neutral-400 hover:text-primary transition-colors cursor-pointer"
              >
                View Full Shopping Bag Page &rarr;
              </button>
            </div>

            {/* SSL NOTICE */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
              <FiLock className="text-primary text-xs shrink-0" />
              <span>256-bit encrypted checkout powered by Stripe</span>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* FREE SHIPPING PROGRESS BAR (RETAINED FOR FUTURE CAMPAIGNS) */}
        {hasItems && (
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <FiGift className="text-primary text-xs" />
                {remainingForFreeShipping > 0 ? (
                  <>
                    Add{" "}
                    <span className="font-mono font-bold text-primary">
                      ${remainingForFreeShipping.toFixed(2)}
                    </span>{" "}
                    more for Free Delivery
                  </>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    You unlocked Free Delivery! 🎉
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-neutral-400">
                ${FREE_SHIPPING_THRESHOLD} Target
              </span>
            </div>

            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* FREE GIFT / BOGO UNLOCKED BANNER */}
        {hasItems && freeItems && freeItems.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-primary/10 to-transparent border border-primary/30 flex items-center gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 text-base">
              <FiGift />
            </div>
            <div className="text-xs min-w-0 flex-1">
              <p className="font-semibold text-primary">
                Special Reward Unlocked!
              </p>
              <p className="text-neutral-300 truncate">
                You earned {freeItems[0].quantity}x Free{" "}
                {freeItems[0].name || "Artisanal Treat"}!
              </p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-16 flex items-center justify-center">
            <CustomLoading />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !hasItems && (
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FiShoppingBag className="text-2xl" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-medium text-white">
                Your Bag is Empty
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Explore our fresh daily assortment of artisanal cookies and
                treats.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                handleClose();
                router.push("/shop-product");
              }}
              text="Explore Bakery Menu"
              className="mt-2"
            />
          </div>
        )}

        {/* CART ITEMS LIST */}
        {!isLoading && hasItems && (
          <div className="space-y-3 divide-y divide-white/5">
            {cartItems.map((cartItem) => {
              const product = cartItem?.product || {};
              const images = product.images || [];
              const imgUrl = images[0] || "/images/cookie-placeholder.jpg";
              const unitPrice = CartService.getItemUnitPrice(cartItem);
              const qty = cartItem?.quantity || 1;
              const lineTotal = unitPrice * qty;
              const isSelected = selectedItems?.some(
                (i) => i?.id === cartItem?.id,
              );

              return (
                <div
                  key={cartItem?.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-white/[0.04] border-primary/35 shadow-md shadow-black/30"
                      : "bg-white/[0.015] border-white/10 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* CHECKBOX */}
                    <button
                      type="button"
                      onClick={() => handleToggleItemSelect(cartItem)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-black shadow-xs shadow-primary/30"
                          : "border-white/20 bg-black/40 hover:border-primary/50 text-transparent"
                      }`}
                      aria-label="Select item"
                    >
                      <FiCheck className="text-xs stroke-[3]" />
                    </button>

                    {/* THUMBNAIL */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                      <Image
                        src={getFullImageLink(imgUrl)}
                        alt={product.name || "Product"}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* CONTENT COLUMN (matches exact 64px image height) */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-16 py-0.5">
                      {/* ROW 1: TITLE, UNIT PRICE & TRASH */}
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/shop-product/${
                              product.id || cartItem.product_id
                            }`}
                            onClick={handleClose}
                            className="font-serif text-sm font-medium text-white hover:text-primary transition-colors truncate block"
                          >
                            {product.name || "Artisanal Treat"}
                          </Link>
                          <span className="text-[11px] font-mono text-neutral-400 block -mt-0.5">
                            ${unitPrice.toFixed(2)} each
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(cartItem)}
                          className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0 -mt-0.5"
                          title="Remove item"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>

                      {/* ROW 2: CONTROLS & LINE TOTAL */}
                      <div className="flex items-center justify-between">
                        {/* STEPPER */}
                        <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg border border-white/10">
                          <button
                            type="button"
                            disabled={qty <= 1}
                            onClick={() => handleUpdateQty(cartItem, qty - 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            <FiMinus className="text-[10px]" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-bold text-white">
                            {qty}
                          </span>
                          <button
                            type="button"
                            disabled={qty >= 99}
                            onClick={() => handleUpdateQty(cartItem, qty + 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                          >
                            <FiPlus className="text-[10px]" />
                          </button>
                        </div>

                        {/* LINE TOTAL */}
                        <div className="text-right">
                          <span className="font-mono font-bold text-primary text-sm sm:text-base">
                            ${lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SlideOverDrawer>
  );
}
