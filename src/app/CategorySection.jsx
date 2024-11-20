"use client";
import { getProductsByCategory } from "@/apis/products";
import Button from "@/Shared/Button";
import Heading from "@/Shared/Heading";
import ProductCardOnCategory from "@/Shared/ProductCardOnCategory";
import Tabs from "@/Shared/Tabs";
import { errorHandler } from "@/Utils/errorHandler";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategorySection = ({ tabs }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [data, setData] = useState([]);
  console.log({ activeTab, data });

  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  useEffect(() => {
    setIsCategoryLoading(true);
    getProductsByCategory({ id: activeTab })
      .then((res) => {
        if (res?.data) {
          console.log({ res });
          setData(res);
          setIsCategoryLoading(false);
        }
      })
      .catch((err) => {
        setIsCategoryLoading(false);
        console.log({ err });
        errorHandler({ err, isLoading: setIsCategoryLoading });
      });
  }, [activeTab]);

  return (
    <div className="space-y-10">
      <Heading subHeading={"Online Store"} heading={"Explore Categories"} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.data?.map((product) => (
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
};

export default CategorySection;
