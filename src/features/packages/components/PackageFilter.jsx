"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import {
  PackageService,
  PACKAGE_SORT_OPTIONS,
  PACKAGE_UNITS,
  PACKAGE_STATUSES,
} from "../services";

/**
 * Reusable Combo Package Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function PackageFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const unitOptions = useMemo(() => PACKAGE_UNITS, []);
  const statusOptions = useMemo(
    () => PACKAGE_STATUSES.filter((s) => s.value !== ""),
    []
  );
  const sortOptions = useMemo(
    () => PACKAGE_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

  const filterFields = useMemo(
    () => [
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
        colSpan: "sm:col-span-2 lg:col-span-1",
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
        colSpan: "sm:col-span-2 lg:col-span-2",
      },
    ],
    [unitOptions, statusOptions, sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
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
    setFilters(defaultVals || PackageService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={PackageService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search combo packages by name..."
      title="Advanced Package Filters"
      totalItems={totalItems}
      itemLabel="packages"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
    />
  );
}

PackageFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
