"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "motion/react";
import { errorHandler } from "@/helpers/errorHandler";
import { useGetAllProductsQuery } from "@/redux/apis/productApis";
import Heading from "./ui/heading/Heading";
import Tabs from "./ui/tab/Tabs";
import ProductCardOnCategory from "./ui/ProductCardOnCategory";
import NavigateHandler from "./ui/buttons/NavigateHandler";

import { ProductCardOnCategorySkeleton } from "./ui/products";

export default function CategorySection({ tabs }) {
  // CATEGORY TAB
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id);

  // GET PRODUCTS BY CATEGORY ID
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllProductsQuery(
      {
        category_id: activeTab,
      },
      { skip: !activeTab }
    );

  // REFETCH IF CATEGORY TAB CHANGES
  useEffect(() => {
    if (activeTab) {
      refetch();
    }
  }, [activeTab, refetch]);

  // HANDLE ERROR
  useEffect(() => {
    if (isError && error) {
      errorHandler({ err: error });
    }
  }, [isError, error]);

  const productList = data?.data || [];

  const renderProductsContent = () => {
    if (isLoading || isFetching) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, n) => (
            <ProductCardOnCategorySkeleton key={n} />
          ))}
        </div>
      );
    }

    if (productList.length > 0) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {productList.map((product) => (
              <ProductCardOnCategory key={product?.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
        <p className="text-sm sm:text-base">
          No handcrafted treats currently listed under this category.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* <============= HEADING =============> */}
      <Heading
        subHeading="Fresh from the Oven"
        heading="Signature Creations"
      />

      {/* <============= TABS =============> */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* <============= PRODUCTS GRID =============> */}
      <div className="min-h-[200px]">
        {renderProductsContent()}
      </div>

      {/* <============= NAVIGATE TO ALL PRODUCTS PAGE =============> */}
      <div className="flex flex-col justify-center items-center pt-2">
        <NavigateHandler text="Explore Full Menu" route="/shop-product" />
      </div>
    </div>
  );
}

CategorySection.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    })
  ),
};
