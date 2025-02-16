"use client";
import { errorHandler } from "@/helpers/errorHandler";
import { useGetAllProductsQuery } from "@/redux/apis/productApis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomLoading from "./UI/loader/CustomLoading";
import Heading from "./UI/Heading/Heading";
import Button from "./UI/buttons/Button";
import Tabs from "./UI/tab/Tabs";
import ProductCardOnCategory from "./UI/ProductCardOnCategory";

export default function CategorySection({ tabs }) {
  const router = useRouter();
  // CATEGORY TAB
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  // GET PRODUCT BY CATEGORY ID
  const products = useGetAllProductsQuery({
    category_id: activeTab,
  });

  // REFETCH IF CATEGORY TAB CHANGE
  useEffect(() => {
    products.refetch();
  }, [activeTab]);

  // IF ANY ERROR
  useEffect(() => {
    if (products.isError) {
      errorHandler({ err: products.error });
    }
  }, []);

  /* *******************************
  
  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
  if (products.isLoading) {
    return <CustomLoading />;
  }
  return (
    <div className="space-y-10">
      {/* <============= HEADING =============> */}
      <Heading subHeading={"Online Store"} heading={"Explore Categories"} />

      {/* <============= TABS =============> */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <============= PRODUCTS =============> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.data?.data?.map((product) => (
          <ProductCardOnCategory key={product?.id} product={product} />
        ))}
      </div>

      {/* <============= NAVIGATE TO ALL PRODUCTS PAGE =============> */}
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
