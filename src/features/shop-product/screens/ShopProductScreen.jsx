"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ui/products/ProductCard";
import ShopProductFilter from "../components/ShopProductFilter";
import { useShopProducts, useCategories } from "../hooks";
import { ProductService } from "../services";
import Pagination from "@/components/ui/table/Pagination";
import CustomLoading from "@/components/ui/loader/CustomLoading";

function ShopProducts() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get("searchTerm") || "";

  // DATABASE FILTER OWNED BY REACT STATE, INITIALIZED VIA DOMAIN SERVICE
  const [filters, setFilters] = useState(() =>
    ProductService.getDefaultFilters(initialSearch)
  );

  // Sync search param when URL changes
  useEffect(() => {
    if (initialSearch) {
      setFilters((prev) => ({
        ...prev,
        searchTerm: initialSearch,
        page: 1,
      }));
    }
  }, [initialSearch]);

  // ISOLATED API QUERIES & ERROR HANDLING
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const {
    products,
    totalCount,
    isLoading: isProductsLoading,
    isError,
    refetch,
  } = useShopProducts(filters);

  const isLoading = isProductsLoading || isCategoriesLoading;

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 pb-20">
      {/* <============================= COMPACT EDITORIAL HEADER ============================> */}
      <section className="relative pt-24 sm:pt-28 pb-10 sm:pb-12 text-center overflow-hidden">
        {/* SUBTLE AMBIENT GLOW */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[180px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-3">
          {/* BREADCRUMB BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-primary/20 backdrop-blur-md text-[11px] uppercase font-semibold tracking-widest text-primary">
            <Link href="/" className="hover:underline text-neutral-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-primary/60">/</span>
            <span>Artisan Bakery Shop</span>
          </div>

          {/* PAGE TITLE */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
            Fresh From Our Ovens
          </h1>

          {/* SUBTITLE */}
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
            Handcrafted cookies, artisanal celebration cakes, and sweet gourmet treats baked daily with love and the finest ingredients.
          </p>

          {/* WAVY ACCENT DIVIDER */}
          <div className="w-[80px] mx-auto pt-1">
            <div className="wavy-line-heading"></div>
          </div>
        </div>
      </section>

      {/* <============================= MAIN SHOP CONTENT ============================> */}
      <div className="w-full px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 space-y-8">
        {/* SHOP PRODUCT FILTER */}
        <ShopProductFilter
          categories={categories}
          filters={filters}
          setFilters={setFilters}
          totalProducts={totalCount}
        />

        {/* PRODUCTS GRID / SKELETON / ERROR / EMPTY STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white/5 border border-white/5"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-red-500/20 bg-red-500/[0.03] rounded-3xl space-y-3">
            <p className="font-serif text-xl sm:text-2xl text-red-400">
              Unable to load treats
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md">
              There was an issue connecting to the bakery catalog. Please try again.
            </p>
            <button
              type="button"
              onClick={() => refetch && refetch()}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-primary/20"
            >
              Retry Connection
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/5 bg-white/[0.02] rounded-3xl space-y-3">
            <p className="font-serif text-xl sm:text-2xl text-white">
              No handcrafted treats found
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-md">
              We couldn&apos;t find any items matching your selected criteria. Try adjusting your filters or clearing your search.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters(ProductService.getDefaultFilters(""))
              }
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalCount > (filters.limit || 12) && (
          <div className="pt-6 flex justify-center">
            <Pagination
              setFilters={setFilters}
              filters={filters}
              total={totalCount}
              totalPage={ProductService.calculateTotalPages(
                totalCount,
                filters.limit || 12
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopProductScreen() {
  return (
    <Suspense fallback={<CustomLoading />}>
      <ShopProducts />
    </Suspense>
  );
}
