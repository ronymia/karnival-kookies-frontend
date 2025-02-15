"use client";
import CustomLoading from "@/Shared/CustomLoading";
import FixedBgComponent from "@/Shared/FixedBgComponent";
import { Pagination } from "@/Shared/Paginations/Pagination";
import TableComponentHeading from "@/Shared/TableComponentHeading";
import NavigateComponent from "@/Utils/navigate";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import FilterComponent from "./FilterComponent";
import ProductCard from "@/components/UI/ProductCard";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";
import { useGetAllProductsQuery } from "@/redux/apis/productApis";
import { RiSoundModuleFill } from "react-icons/ri";

export default function ProductPage() {
  // FILTER SIDEBAR
  const [sidebar, setSidebar] = useState(false);

  // DATABASE FILTER
  const [filters, setFilters] = useState({
    searchTerm: "",
    page: 1,
    limit: 10,
    category_id: "",
    fromPrice: "",
    toPrice: "",
    sortByNewest: "",
    sortOrder: "",
    HighToLow: "",
    lowToHigh: "",
  });

  // GET CATEGORIES
  const categories = useGetAllCategoriesQuery({});
  // GET PRODUCTS
  const products = useGetAllProductsQuery({
    searchTerm: filters?.searchTerm,
    page: filters?.page,
    limit: filters?.limit,
    category_id: filters?.category_id,
    fromPrice: filters?.fromPrice,
    toPrice: filters?.toPrice,
    sortBy: filters?.sortByNewest,
    HighToLow: filters?.HighToLow,
    lowToHigh: filters?.lowToHigh,
  });

  // REFETCH IF FILTERS CHANGE
  useEffect(() => {
    products.refetch();
  }, [filters]);

  // LOADING STATE
  if (categories.isLoading || products.isLoading) {
    return <CustomLoading />;
  }
  return (
    <div className={``}>
      {/* <============================= PAGE HEADER ============================> */}
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
                {"//"} <span>Products</span>
              </div>
            }
            heading={"All Products"}
          />
        }
      />

      {/* <============================= PRODUCTS SHOW HERE ============================> */}
      <div className={`flex gap-5 mx-5 md:mx-10 relative h-full`}>
        {/* FILTERS SIDE BAR */}
        {!sidebar && (
          /* <============================= FILTERS SIDE BAR CLOSE BUTTON ============================> */
          <div
            role="button"
            onClick={() => setSidebar(true)}
            className={`fixed lg:hidden left-0 bottom-40 z-[1000] py-4 pr-4 rounded-r-full bg-primary text-2xl text-base-300 font-bold  hover:bg-secondary transition-all active:scale-95`}
          >
            <RiSoundModuleFill className={`rotate-90`} />
          </div>
        )}

        {/* FILTERS SIDE BAR */}
        <div
          className={`overflow-auto bg-base-100 px-3 transition-all min-w-[300px] ${
            sidebar
              ? "fixed left-0 top-0 z-[1000] h-full"
              : "fixed -left-[340px] bottom-0"
          } lg:sticky lg:top-[96px] lg:h-[calc(100vh-96px)]`}
        >
          {/* FILTERS */}
          <div className={`relative py-16 space-y-10`}>
            {/* TOTAL SEARCH RESULTS */}
            <h2 className={`text-xl font-bold text-primary`}>
              Total{" "}
              <span className={`text-4xl font-bold`}>
                {products.data?.meta?.total}
              </span>{" "}
              {products.data?.meta?.total > 1 ? "Products" : "Product"} Found
            </h2>
            {/* FILTERS COMPONENT */}
            <FilterComponent setFilters={setFilters} />

            {/* SELECT PRODUCT CATEGORY */}
            <div>
              <div className={`flex flex-col justify-center items-start`}>
                <div className={`flex justify-between items-center w-full`}>
                  <h2 className={`text-2xl lg:text-3xl font-bold text-primary`}>
                    Product Categories
                  </h2>
                  <FiX
                    onClick={() => setSidebar(false)}
                    className={`absolute top-2 right-0 text-4xl lg:hidden p-2 rounded-full w-auto text-primary bg-secondary transition-transform hover:scale-105 active:scale-95`}
                  />
                </div>

                <div className={`w-full `}>
                  <div className={`wavy-line-nav`}></div>
                </div>
              </div>
              <div
                className={`flex flex-col justify-start items-start gap-2 w-full`}
              >
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, category_id: "" }));
                  }}
                  className={`text-xl font-medium hover:text-primary p-2 rounded-lg transition-all w-full ${
                    !filters?.category_id && "bg-secondary text-primary"
                  }`}
                >
                  All
                </button>
                {categories?.data?.data?.map((category, i) => (
                  <button
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        category_id: category?.id,
                      }));
                    }}
                    key={i}
                    className={`text-xl font-medium hover:text-primary p-2 rounded-lg transition-all w-full ${
                      filters?.category_id === category?.id &&
                      "bg-secondary text-primary"
                    }`}
                  >
                    {category?.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE PAGE */}
        {products.isLoading ? (
          <CustomLoading />
        ) : (
          <div className={`space-y-5`}>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-5 `}
            >
              {products?.data?.data?.map((product, i) => (
                <ProductCard key={i} product={product} />
              ))}
            </div>
            {/* PAGINATION */}
            <Pagination
              setFilters={setFilters}
              filters={filters}
              total={products?.meta?.total}
            />
          </div>
        )}
      </div>
    </div>
  );
}
