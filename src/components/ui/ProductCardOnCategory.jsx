"use client";

import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { FiArrowRight } from "react-icons/fi";
import { extractTextFromHTML } from "@/utils/extractTextFromHtml";
import { getFullImageLink } from "@/utils/getFullImageLink";

export default function ProductCardOnCategory({ product }) {
  const isDiscount = product?.is_discount_enable === 1;
  const originalPrice = Number.parseFloat(product?.price || 0).toFixed(2);
  const netPrice = isDiscount
    ? Number.parseFloat(product?.net_price || 0).toFixed(2)
    : originalPrice;

  const imageUrl = getFullImageLink(
    product?.images?.length > 0 ? product.images[0] : null
  );

  const rawDescription = product?.description
    ? extractTextFromHTML(product.description)
    : "";

  return (
    <Link
      href={product?.id ? `/shop-product/${product.id}` : "#"}
      className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-[#161311]/80 hover:bg-[#1a1614] backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5"
    >
      {/* PRODUCT IMAGE CONTAINER */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 group-hover:border-primary/40 transition-colors">
        <Image
          src={imageUrl || "/noDataFound.svg"}
          alt={product?.name || "Bakery Product"}
          fill
          sizes="(max-width: 640px) 72px, 88px"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
        />

        {/* DISCOUNT MINI BADGE */}
        {isDiscount && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full bg-red-600/90 text-white text-[9px] font-bold tracking-wider uppercase">
            SALE
          </div>
        )}
      </div>

      {/* PRODUCT INFO & PRICING */}
      <div className="flex flex-col justify-between grow min-w-0 pr-1">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-sans text-sm sm:text-base font-semibold text-white group-hover:text-primary transition-colors truncate">
              {product?.name}
            </h3>
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="font-sans text-sm sm:text-base font-bold tracking-tight text-primary">
                ${netPrice}
              </span>
              {isDiscount && (
                <span className="text-[11px] sm:text-xs font-normal text-neutral-400 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-normal line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
            {rawDescription || "Handcrafted fresh daily with premium artisan ingredients."}
          </p>
        </div>

        {/* HOVER CALLOUT */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-primary/80 group-hover:text-primary transition-colors mt-1.5">
          <span>View Treat</span>
          <FiArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

ProductCardOnCategory.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    net_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_discount_enable: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
  }),
};
