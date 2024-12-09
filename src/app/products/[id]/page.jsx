"use client";

import { useEffect, useState } from "react";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import NavigateComponent from "@/Utils/navigate";
import axios from "axios";
import ButtonWrapper from "./ButtonWrapper";
import ProductCard from "@/Shared/ProductCard";
import Reviews from "./Reviews";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";

export default function SingleProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${params?.id}`;
        const productResponse = await axios.get(productUrl);

        const productData = productResponse?.data?.data;

        const relatedProductsUrl = `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/products?limit=4&page=${1}&category_id=${productData?.category_id}`;

        const [product, relatedProducts] = await Promise.all([
          axios.get(productUrl),
          axios.get(relatedProductsUrl),
        ]);

        setProduct(product.data.data);
        setRelatedProducts(relatedProducts.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      {/* PAGE HEADER */}
      <FixedBgComponent
        url="/chocolate_bg.jpg"
        wrapperClass={`pt-60 pb-40`}
        component={
          <TableComponentHeading
            routes={
              <div className={`text-[14px]`}>
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Home" route="/" />
                </span>{" "}
                {"//"}{" "}
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Products" route="/products" />
                </span>{" "}
                {"//"}{" "}
                <span className={`text-primary cursor-pointer`}>
                  <NavigateComponent text="Chocolate" route="/" />
                </span>{" "}
                {"//"} <span>All Products</span>
              </div>
            }
            heading={product?.name}
          />
        }
      />
      <div className={`relative`}>
        <Image
          className={`absolute w-full -top-2 sm:-top-5 left-0`}
          src="/dark_temp.png"
          alt="dark temp"
          width={100}
          height={100}
        />

        {/* CATEGORY NAME */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 py-32 px-5 sm:px-10`}
        >
          {/* IMAGE SLIDER */}
          <ImageSlider
            images={product?.images?.length > 0 ? product?.images : []}
          />

          {/* PRODUCT DETAILS */}
          <div className={`space-y-5 mt-10`}>
            <p className={`text-primary text-[30px]`}>
              {product?.discount_price ? (
                <span className={`flex gap-3 items-center`}>
                  <del className={`text-base-200`}>
                    ${product?.regular_price}
                  </del>
                  <span className={`text-red-500`}>
                    ${product?.discount_price}
                  </span>
                </span>
              ) : (
                <span className={`text-primary`}>
                  ${product?.regular_price}
                </span>
              )}
            </p>
            <p>{product?.description?.slice(0, 300)}...</p>
            <div className={`space-x-5`}>
              <ButtonWrapper text={"Add to cart"} id={product?.id} />
            </div>
            <p className={`text-[20px]`}>
              <span className={`text-primary font-bold`}>Category: </span>
              <span>{product?.category?.name}</span>
            </p>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div
          className={`flex flex-col justify-center items-center gap-10 px-5 sm:px-10 pb-40`}
        >
          <h2
            className={`text-[30px] hover:text-primary cursor-pointer border-b-4 border-primary inline-block`}
          >
            Description
          </h2>
          <p>{product?.description}</p>
        </div>

        {/* REVIEW */}
        <Reviews />

        {/* RELATED PRODUCTS */}
        <div
          className={`flex flex-col justify-center items-center gap-10 px-5 sm:px-10 pb-40`}
        >
          <h2 className={`text-[30px]`}>Related products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct?.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
