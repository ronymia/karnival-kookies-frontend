"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import {
  OrderService,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  ORDER_SORT_OPTIONS,
} from "../services";

/**
 * Reusable Order Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function OrderFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const statusOptions = useMemo(() => ORDER_STATUSES, []);
  const paymentOptions = useMemo(() => PAYMENT_METHODS, []);
  const sortOptions = useMemo(
    () => ORDER_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

  const filterFields = useMemo(
    () => [
      {
        name: "status",
        type: "select",
        label: "Fulfillment Status",
        placeholder: "All Statuses",
        options: statusOptions,
        isClearable: true,
        isSearchable: true,
      },
      {
        name: "payment_method",
        type: "select",
        label: "Payment Method",
        placeholder: "All Methods",
        options: paymentOptions,
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
    [statusOptions, paymentOptions, sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      status: formData.status || "",
      payment_method: formData.payment_method || "",
      sortBy: formData.sortBy || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || OrderService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={OrderService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search by order ID, tracking #, customer name, email..."
      title="Filter & Sort Orders"
      totalItems={totalItems}
      itemLabel="orders"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

OrderFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
