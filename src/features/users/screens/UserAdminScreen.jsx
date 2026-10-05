"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEye, FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import {
  UserBreadcrumbs,
  UserFilter,
  UserDrawer,
  UserViewDrawer,
} from "../components";
import { useGetAllUsers } from "../hooks";
import {
  UserService,
  USER_TABLE_COLUMNS,
  formatUserRows,
} from "../services";

export default function UserAdminScreen() {
  // Query Hooks
  const { users, isLoading, isFetching } = useGetAllUsers({ limit: 100 });

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: "",
    is_verified: "",
    sortBy: "",
  });

  // Drawer States
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setIsFormDrawerOpen(true);
  };

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsViewDrawerOpen(true);
  };

  // Client-Side Sort & Filter
  const displayUsers = useMemo(() => {
    return UserService.filterAndSort(users, {
      searchTerm,
      role: filters.role,
      is_verified: filters.is_verified,
      sortBy: filters.sortBy,
    });
  }, [users, searchTerm, filters.role, filters.is_verified, filters.sortBy]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatUserRows(displayUsers, filters.page, filters.limit);
  }, [displayUsers, filters.page, filters.limit]);

  // Table Actions
  const tableActions = useMemo(
    () => [
      {
        name: "view",
        handler: handleOpenView,
        Icon: FiEye,
        disabledOn: [],
      },
      {
        name: "edit",
        handler: handleOpenEdit,
        Icon: FiEdit2,
        disabledOn: [],
      },
    ],
    []
  );

  // Active Filter Chips
  const activeChips = useMemo(() => {
    return UserService.formatActiveChips({
      searchTerm,
      role: filters.role,
      is_verified: filters.is_verified,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveRole: () =>
        setFilters((prev) => ({ ...prev, role: "", page: 1 })),
      onRemoveVerified: () =>
        setFilters((prev) => ({ ...prev, is_verified: "", page: 1 })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [searchTerm, filters.role, filters.is_verified, filters.sortBy]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* CREATE / EDIT SLIDE-OVER DRAWER */}
      <UserDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setSelectedUser(null);
        }}
        editData={selectedUser}
      />

      {/* VIEW DETAILS SLIDE-OVER DRAWER */}
      <UserViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedUser(null);
        }}
        data={selectedUser}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <UserBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              User Account Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Manage system staff roles, administrators, store managers, and registered customer profiles.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={handleOpenCreate}
            className="shrink-0 self-start sm:self-auto shadow-lg shadow-primary/20"
          >
            Add User
          </Button>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <UserFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayUsers.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayUsers.length}
              </strong>{" "}
              {displayUsers.length === 1 ? "user account" : "user accounts"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching}
            rows={tableRows}
            columns={USER_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayUsers.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
