"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import { useGetCategories } from "@/features/category";
import {
  ProductService,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_UNITS,
  PRODUCT_STATUSES,
} from "../services";

/**
 * Reusable Product Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function ProductFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const { categories } = useGetCategories({ limit: 100 });

  const categoryOptions = useMemo(() => {
    return (
      categories?.map((c) => ({
        value: String(c.id),
        label: c.name,
      })) || []
    );
  }, [categories]);

  const unitOptions = useMemo(() => {
    return PRODUCT_UNITS;
  }, []);

  const statusOptions = useMemo(() => {
    return PRODUCT_STATUSES.filter((s) => s.value !== "");
  }, []);

  const sortOptions = useMemo(() => {
    return PRODUCT_SORT_OPTIONS.filter((s) => s.value !== "");
  }, []);

  const filterFields = useMemo(() => [
    {
      name: "category_id",
      type: "select",
      label: "Category",
      placeholder: "All Categories",
      options: categoryOptions,
      isClearable: true,
      isSearchable: true,
    },
    {
      name: "unit",
      type: "select",
      label: "Measurement Unit",
      placeholder: "All Units",
      options: unitOptions,
      isClearable: true,
      isSearchable: true,
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      placeholder: "All Statuses",
      options: statusOptions,
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
      label: "Price Range ($)",
      minName: "minPrice",
      maxName: "maxPrice",
      minPlaceholder: "Min $",
      maxPlaceholder: "Max $",
      step: "0.01",
      min: 0,
      colSpan: "sm:col-span-2",
    },
    {
      type: "range",
      label: (values) =>
        `Quantity Range ${values?.unit ? `(${values.unit})` : "(Stock)"}`,
      minName: "minQuantity",
      maxName: "maxQuantity",
      minPlaceholder: "Min Stock",
      maxPlaceholder: "Max Stock",
      min: 0,
      colSpan: "sm:col-span-2",
    },
  ], [categoryOptions, unitOptions, statusOptions, sortOptions]);

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      category_id: formData.category_id || "",
      unit: formData.unit || "",
      status: formData.status || "",
      sortBy: formData.sortBy || "",
      minPrice: formData.minPrice || "",
      maxPrice: formData.maxPrice || "",
      minQuantity: formData.minQuantity || "",
      maxQuantity: formData.maxQuantity || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || ProductService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={ProductService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by product name..."
      title="Advanced Product Filters"
      totalItems={totalItems}
      itemLabel="products"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
    />
  );
}

ProductFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
