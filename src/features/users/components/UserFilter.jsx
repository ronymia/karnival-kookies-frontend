"use client";

import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { FormFilterPanel } from "@/components/filters";
import {
  UserService,
  USER_ROLES,
  USER_SORT_OPTIONS,
} from "../services";

/**
 * Reusable User Filter Panel powered by schema-driven FormFilterPanel.
 */
export default function UserFilter({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  activeChips = [],
  activeFilterCount = 0,
  totalItems = 0,
}) {
  const roleOptions = useMemo(() => USER_ROLES, []);
  const verifiedOptions = useMemo(
    () => [
      { value: "true", label: "Email Verified" },
      { value: "false", label: "Unverified Email" },
    ],
    []
  );
  const sortOptions = useMemo(
    () => USER_SORT_OPTIONS.filter((s) => s.value !== ""),
    []
  );

  const filterFields = useMemo(
    () => [
      {
        name: "role",
        type: "select",
        label: "User Role",
        placeholder: "All Roles",
        options: roleOptions,
        isClearable: true,
        isSearchable: true,
      },
      {
        name: "is_verified",
        type: "select",
        label: "Email Verification",
        placeholder: "All Statuses",
        options: verifiedOptions,
        isClearable: true,
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
    [roleOptions, verifiedOptions, sortOptions]
  );

  const handleApply = (formData) => {
    setFilters((prev) => ({
      ...prev,
      role: formData.role || "",
      is_verified: formData.is_verified ?? "",
      sortBy: formData.sortBy || "",
      page: 1,
    }));
  };

  const handleReset = (defaultVals) => {
    setSearchTerm("");
    setFilters(defaultVals || UserService.getDefaultFilters());
  };

  return (
    <FormFilterPanel
      fields={filterFields}
      values={filters}
      defaultValues={UserService.getDefaultFilters()}
      onApply={handleApply}
      onReset={handleReset}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search users by name, email, phone, city..."
      title="Filter & Sort Users"
      totalItems={totalItems}
      itemLabel="users"
      activeChips={activeChips}
      activeFilterCount={activeFilterCount}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    />
  );
}

UserFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeChips: PropTypes.array,
  activeFilterCount: PropTypes.number,
  totalItems: PropTypes.number,
};
