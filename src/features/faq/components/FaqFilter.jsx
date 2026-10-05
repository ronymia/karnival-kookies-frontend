"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import { FaqService, FAQ_SORT_OPTIONS } from "../services";

/**
 * Reusable FAQ Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function FaqFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const sortOptions = useMemo(
    () => FAQ_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

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
    setFilters(defaultVals || FaqService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={FaqService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search FAQ by question keyword or answer text..."
      title="Filter & Sort FAQs"
      totalItems={totalItems}
      itemLabel="FAQs"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

FaqFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
