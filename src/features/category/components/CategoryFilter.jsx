"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import { CategoryService, CATEGORY_SORT_OPTIONS } from "../services";

/**
 * Category Filter Panel powered by schema-driven FormFilterPanel and React Hook Form.
 */
export default function CategoryFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const sortOptions = useMemo(() => {
    return CATEGORY_SORT_OPTIONS.filter((opt) => opt.value !== "");
  }, []);

  const filterFields = useMemo(
    () => [
      {
        name: "sortBy",
        type: "select",
        label: "Sort Order",
        placeholder: "Default Order",
        options: sortOptions,
        isClearable: true,
        isSearchable: true,
        colSpan: "max-w-xs",
      },
    ],
    [sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: formData.sortBy || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || CategoryService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={CategoryService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search categories by name or description..."
      title="Filter & Sort Categories"
      totalItems={totalItems}
      itemLabel="categories"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

CategoryFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
