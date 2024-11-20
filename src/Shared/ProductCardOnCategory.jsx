import { getFullImageLink } from "@/Utils/getFullImageLink";
import React from "react";

const ProductCardOnCategory = ({ product }) => {
  return (
    <div className={`flex items-center`}>
      <img
        className="h-20 w-20 rounded-full"
        src={getFullImageLink(product?.images[0]?.file, "Products")}
        alt={product?.name}
      />
      <div className={`flex-grow`}>
        <div
          className={`flex justify-between items-center text-primary lg:text-2xl`}
        >
          <p className={` `}>{product?.name}</p>
          <div className={`h-[1px] bg-primary mx-3 flex-grow `}></div>
          <p>{product?.regularPrice}</p>
        </div>
        <p>
          {product?.description
            ? product?.description?.length > 100
              ? `${product?.description?.slice(0, 100)}...`
              : product?.description
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProductCardOnCategory;
