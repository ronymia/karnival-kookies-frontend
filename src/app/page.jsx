"use client";

import ProductCard from "@/Shared/ProductCard";
import CategorySection from "./CategorySection";
import Slider from "./slider";
import Heading from "@/components/UI/Heading/Heading";
import HomeSearchWrapper from "@/components/UI/SearchFields/HomeSearchWrapper";
import NavigateHandler from "@/components/UI/buttons/NavigateHandler";
import FixedBgComponent from "@/components/layouts/FixedBgComponent";
import { useEffect, useState } from "react";

const fetchData = async (url) => {
  try {
    const res = fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
};

// export function generateMetadata({ searchParams }) {
//   const currentUrl = searchParams.url || "";
//   const result = fetchData(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/meta-data?url=${"home"}`
//   );
//   const metadata = result?.data[0];

//   return {
//     title: metadata?.title || "check",
//     description: metadata?.description || "Default Description",
//   };
// }

export default function HomePage() {
  // const [productData, categoryData] = await  Promise.all([
  //   fetchData(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/products?page=1&perPage=8`
  //   ),
  //   fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/categories`),
  //   // fetchData(`${process.env.NEXT_PUBLIC_BACKEND_URL}/packages`),
  // ]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, categories] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/products?page=1&perPage=8`
          ).then((res) => res.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1.0/categories`
          ).then((res) => res.json()),
        ]);

        setProductData(products);
        setCategoryData(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const products = productData?.data || [];
  const categories = categoryData?.data || [];
  // const packages = packageData?.data || [];
  // const products = [];
  // const categories = [];
  const packages = [];

  const tabs = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  const slides = [
    { id: 1, image: "/chocolate.jpg" },
    { id: 2, image: "/cake.jpg" },
    { id: 3, image: "/cherry.jpg" },
    { id: 4, image: "/candy.jpg" },
  ].map((image) => image.image);

  return (
    <div className="flex flex-col gap-20 overflow-hidden pb-20">
      {/* <------------------------ BANNER SLIDER ---------------------------> */}
      <Slider
        prevNextBtn
        img={slides}
        running={true}
        dots={true}
        borderWidth={2}
        borderClr={"#000"}
      />

      {/* <------------------------------ FEATURED PRODUCTS ------------------------------------> */}
      <section className="space-y-10">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading
          subHeading={"Online Store"}
          heading={"Discover Sweet Delicious"}
        />

        {/* <------------------------ SEARCH BOX FOR FEATURE PRODUCTS --------------------------> */}
        <HomeSearchWrapper />

        {/* <------------------------ FEATURE PRODUCT LIST --------------------------> */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {/* <------------------------ NAVIGATION --------------------------> */}
        <div className="flex flex-col justify-center items-center">
          <NavigateHandler text={"Online Store"} route={"/products"} />
        </div>
      </section>

      {/* <------------------------ FIX BG COMPONENT --------------------------> */}
      <section className="relative">
        <FixedBgComponent
          component={
            <div className="text-3xl md:text-6xl font-bold text-base-300 space-y-5 text-center relative">
              <p>Made with love</p>
              <p>
                <span className="text-primary">unique sweets</span> for gourmet
              </p>
            </div>
          }
        />
      </section>

      {/* <------------------------ CATEGORY SECTION --------------------------> */}
      <section className="px-5 md:px-10 mb-20">
        <CategorySection tabs={tabs} />
      </section>

      {/* <------------------------ PACKAGES SECTION --------------------------> */}
      <section className="px-5 md:px-10 mb-20">
        {/* <------------------------ HEADING --------------------------> */}
        <Heading subHeading={"Online Store"} heading={"Combo Packages"} />

        {/* <------------------------ PACKAGE LIST --------------------------> */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        {/* <------------------------ NAVIGATE TO PRODUCT PAGE --------------------------> */}
        <div className="flex flex-col justify-center items-center">
          <NavigateHandler text={"See More"} route={"/products"} />
        </div>
      </section>
    </div>
  );
}
