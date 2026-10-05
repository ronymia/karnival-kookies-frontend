"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import {
  CouponCodeService,
  COUPON_DISCOUNT_TYPES,
  COUPON_SORT_OPTIONS,
} from "../services";

/**
 * Reusable Coupon Code Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function CouponCodeFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const discountTypeOptions = useMemo(() => COUPON_DISCOUNT_TYPES, []);
  const sortOptions = useMemo(
    () => COUPON_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

  const filterFields = useMemo(
    () => [
      {
        name: "discount_type",
        type: "select",
        label: "Discount Type",
        placeholder: "All Types",
        options: discountTypeOptions,
        isClearable: true,
        isSearchable: true,
      },
      {
        name: "sortBy",
        type: "select",
        label: "Sort Order",
        placeholder: "Default Order",
        options: sortOptions,
        isClearable: true,
        isSearchable: true,
      },
      {
        type: "range",
        label: "Discount Value Range",
        minName: "minDiscount",
        maxName: "maxDiscount",
        minPlaceholder: "Min Value",
        maxPlaceholder: "Max Value",
        min: 0,
        colSpan: "sm:col-span-2",
      },
    ],
    [discountTypeOptions, sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      discount_type: formData.discount_type || "",
      sortBy: formData.sortBy || "",
      minDiscount: formData.minDiscount || "",
      maxDiscount: formData.maxDiscount || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || CouponCodeService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={CouponCodeService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by promo code (e.g. SUMMER20)..."
      title="Advanced Coupon Filters"
      totalItems={totalItems}
      itemLabel="coupon codes"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

CouponCodeFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
