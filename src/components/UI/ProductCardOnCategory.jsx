import { extractTextFromHTML } from "@/Utils/extractTextFromHtml";
import { getFullImageLink } from "@/Utils/getFullImageLink";
import Image from "next/image";

export default function ProductCardOnCategory({ product }) {
  return (
    <div className={`flex gap-3 items-center`}>
      <Image
        width={100}
        height={100}
        className="h-20 w-20 rounded-full"
        src={getFullImageLink(product?.images[0])}
        alt={product?.name}
      />
      <div className={`flex-grow`}>
        <div
          className={`flex justify-between items-center text-primary lg:text-2xl`}
        >
          <p className={` `}>{product?.name}</p>
          <div className={`h-[1px] bg-primary mx-3 flex-grow `}></div>
          <p>{product?.price}</p>
        </div>
        <p>
          {product?.description
            ? extractTextFromHTML(product.description).length > 100
              ? `${extractTextFromHTML(product.description).slice(0, 100)}...`
              : extractTextFromHTML(product.description)
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
