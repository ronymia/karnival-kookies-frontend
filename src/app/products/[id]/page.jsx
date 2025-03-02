"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Reviews from "./Reviews";
import Image from "next/image";
import ImageSlider from "@/components/ImageSlider";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import FixedBgComponent from "@/components/layouts/FixedBgComponent";
import TableComponentHeading from "@/components/UI/table/TableComponentHeading";
import NavigateComponent from "@/components/UI/navigate/navigate";
import ProductCard from "@/components/UI/ProductCard";
import ButtonWrapper from "./ButtonWrapper";
import { htmlToPlainText } from "@/Utils/htmlToPlainText";

export default function SingleProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/products/${params?.id}`;
        // GET SINGLE PRODUCT
        const productResponse = await axios.get(productUrl);
        const productData = productResponse?.data?.data;
        // GET RELATED PRODUCTS
        const relatedProductsUrl = `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/v1.0/products?limit=4&page=${1}&category_id=${
          productData?.category_id
        }`;

        // GET RELATED PRODUCTS
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
    return <CustomLoading />;
  }

  return (
    <section>
      {/* <========================= PAGE HEADER ==================================> */}
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
                {/* {"//"} <span>All Products</span> */}
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
            {/* PRODUCT NAME */}
            <p className="text-[20px] font-bold hover:text-primary transition-all">
              {product?.name}
            </p>
            {/* PRODUCT PRICE */}
            <div className="flex justify-start items-center gap-2">
              <p
                className={` ${
                  product?.is_discount_enable === 1
                    ? "text-base-200 line-through text-lg"
                    : "text-primary text-2xl"
                }`}
              >
                ${product?.price}
              </p>
              {product?.is_discount_enable === 1 && (
                <p className={`text-2xl text-red-500`}>
                  ${parseFloat(Number(product?.net_price)).toFixed(2)}
                </p>
              )}
            </div>
            {/* PRODUCT DESCRIPTION */}
            <p>{htmlToPlainText(product?.description)}</p>

            {/* ADD TO CART */}
            <div className={`space-x-5`}>
              <ButtonWrapper text={"Add to cart"} id={product?.id} />
            </div>

            {/* CATEGORY NAME */}
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
          <p>{htmlToPlainText(product?.description)}</p>
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
