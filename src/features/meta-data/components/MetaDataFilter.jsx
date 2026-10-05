"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import {
  MetaDataService,
  META_KEYS,
  META_DATA_SORT_OPTIONS,
} from "../services";

/**
 * Reusable SEO Meta Data Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function MetaDataFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const pageOptions = useMemo(() => META_KEYS, []);
  const sortOptions = useMemo(
    () => META_DATA_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

  const filterFields = useMemo(
    () => [
      {
        name: "meta_key",
        type: "select",
        label: "Target Page",
        placeholder: "All Pages",
        options: pageOptions,
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
    ],
    [pageOptions, sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      meta_key: formData.meta_key || "",
      sortBy: formData.sortBy || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || MetaDataService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={MetaDataService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search SEO records by title or description..."
      title="Filter & Sort Meta Data"
      totalItems={totalItems}
      itemLabel="meta records"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

MetaDataFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
