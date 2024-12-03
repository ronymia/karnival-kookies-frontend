"use client";
import { getProductsByCategory } from "@/apis/products";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { useGetAllClientProductsQuery } from "@/redux/apis/productApis";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import Heading from "@/Shared/Heading";
import ProductCardOnCategory from "@/Shared/ProductCardOnCategory";
import Tabs from "@/Shared/Tabs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CategorySection({ tabs }) {
  const router = useRouter();
  // CATEGORY TAB
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  // GET PRODUCT BY CATEGORY ID
  const products = useGetAllClientProductsQuery({
    searchTerm: "",
    page: 1,
    limit: 10,
    category_id: activeTab,
  });

  // REFETCH IF CATEGORY TAB CHANGE
  useEffect(() => {
    products.refetch();
  }, [activeTab]);

  // IF ANY ERROR
  useEffect(() => {
    if (products.isError) {
      errorHandlerV2({ err: products.error });
    }
  }, []);

  /* *******************************
  
  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
  if (products.isLoading) {
    return <CustomLoading />;
  }
  return (
    <div className="space-y-10">
      <Heading subHeading={"Online Store"} heading={"Explore Categories"} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.data?.data?.map((product) => (
          <ProductCardOnCategory key={product?.id} product={product} />
        ))}
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button
          text={"See More"}
          paddings="px-10 py-5"
          handler={() => router.push("/products")}
        />
      </div>
    </div>
  );
}
