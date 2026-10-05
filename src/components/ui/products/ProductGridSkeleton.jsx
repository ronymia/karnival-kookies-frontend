import React from "react";
import PropTypes from "prop-types";
import ProductCardSkeleton from "./ProductCardSkeleton";

/**
 * Grid of luxury ProductCard skeletons.
 */
export default function ProductGridSkeleton({ count = 8, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

ProductGridSkeleton.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};
