"use client";

import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { FilterPanel } from "@/components/filters";
import { useGetPriceBoundsQuery } from "@/redux/apis/productApis";
import {
  ProductService,
  PRICE_PRESETS,
  SORT_OPTIONS,
} from "../services";

export default function ShopProductFilter({
  categories = [],
  filters,
  setFilters,
  totalProducts = 0,
}) {
  // Price bounds query
  const { data: priceBoundsData } = useGetPriceBoundsQuery();
  const maxBoundPrice = Number(priceBoundsData?.data?.max_price || 100);
  const minBoundPrice = Number(priceBoundsData?.data?.min_price || 0);

  // Local draft state for drawer inputs
  const [draftFilters, setDraftFilters] = useState({
    category_id: filters.category_id || "",
    fromPrice: filters.fromPrice || "",
    toPrice: filters.toPrice || "",
    sortBy: ProductService.extractSortKey(filters),
  });

  // Sync draft state when filters change externally
  useEffect(() => {
    setDraftFilters({
      category_id: filters.category_id || "",
      fromPrice: filters.fromPrice || "",
      toPrice: filters.toPrice || "",
      sortBy: ProductService.extractSortKey(filters),
    });
  }, [
    filters.category_id,
    filters.fromPrice,
    filters.toPrice,
    filters.sortByNewest,
    filters.lowToHigh,
    filters.HighToLow,
  ]);

  // Build active filter chips using ProductService
  const activeChips = useMemo(() => {
    return ProductService.formatActiveChips({
      filters,
      categories,
      maxBoundPrice,
      onRemoveCategory: () =>
        setFilters((prev) => ({ ...prev, category_id: "", page: 1 })),
      onRemoveSearch: () =>
        setFilters((prev) => ({ ...prev, searchTerm: "", page: 1 })),
      onRemovePrice: () =>
        setFilters((prev) => ({ ...prev, fromPrice: "", toPrice: "", page: 1 })),
      onRemoveSort: () =>
        setFilters((prev) => ({
          ...prev,
          ...ProductService.mapSortToQueryParams(""),
          page: 1,
        })),
    });
  }, [filters, categories, maxBoundPrice, setFilters]);

  // Count active criteria using ProductService
  const activeCount = ProductService.countActiveFilters(filters);

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      category_id: draftFilters.category_id,
      fromPrice: draftFilters.fromPrice,
      toPrice: draftFilters.toPrice,
      ...ProductService.mapSortToQueryParams(draftFilters.sortBy),
      page: 1,
    }));
  };

  const handleReset = () => {
    const defaultFilters = ProductService.getDefaultFilters("");
    setDraftFilters({
      category_id: "",
      fromPrice: "",
      toPrice: "",
      sortBy: "",
    });
    setFilters(defaultFilters);
  };

  const handleSearchChange = (term) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: term,
      page: 1,
    }));
  };

  return (
    <FilterPanel
      searchTerm={filters.searchTerm || ""}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search cookies, cakes, pastries..."
      defaultOpen={true}
      activeFilterCount={activeCount}
      title="Filters"
      totalItems={totalProducts}
      itemLabel="artisan treats"
      activeChips={activeChips}
      onApply={handleApply}
      onReset={handleReset}
      onClearAll={handleReset}
    >
      {/* 3-COLUMN PRODUCT FILTER FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* 1. CATEGORY */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary/90 block">
            Category
          </label>
          <select
            value={draftFilters.category_id}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                category_id: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-neutral-200 text-xs sm:text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="" className="bg-[#171412]">
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#171412]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. PRICE RANGE */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary/90 block">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="number"
              min="0"
              max={maxBoundPrice}
              placeholder={`Min: $${minBoundPrice}`}
              value={draftFilters.fromPrice}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  fromPrice: e.target.value,
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              min="0"
              max={maxBoundPrice}
              placeholder={`Max: $${maxBoundPrice}`}
              value={draftFilters.toPrice}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  toPrice: e.target.value,
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* PRICE PRESETS */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {PRICE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    fromPrice: preset.min,
                    toPrice: preset.max,
                  }))
                }
                className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-primary/20 text-neutral-300 hover:text-primary border border-white/5 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. SORT ORDER */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary/90 block">
            Sort Order
          </label>
          <select
            value={draftFilters.sortBy}
            onChange={(e) =>
              setDraftFilters((prev) => ({
                ...prev,
                sortBy: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-neutral-200 text-xs sm:text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#171412]"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FilterPanel>
  );
}

ShopProductFilter.propTypes = {
  categories: PropTypes.array,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  totalProducts: PropTypes.number,
};
