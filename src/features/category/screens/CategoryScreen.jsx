"use client";

import { useState, useMemo } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import Table from "@/components/ui/table/Table";
import { PageHeader } from "@/components/ui/heading";
import { Button } from "@/components/ui/buttons";
import { deleteData } from "@/helpers/DeleteData";
import {
  CategoryBreadcrumbs,
  CategoryFilter,
  CategoryDrawer,
} from "../components";
import { useGetCategories, useDeleteCategory } from "../hooks";
import {
  CategoryService,
  CATEGORY_TABLE_COLUMNS,
  formatCategoryRows,
} from "../services";

export default function CategoryScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(() =>
    CategoryService.getDefaultFilters(),
  );

  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    data: null,
  });

  // Queries & Mutations
  const { categories, totalCount, totalPages, isLoading, isFetching } =
    useGetCategories({
      page: filters.page,
      limit: filters.limit,
    });

  const [deleteCategoryMutation, { isLoading: isDeleting }] =
    useDeleteCategory();

  // Processed Client-side Filter & Sort
  const filteredCategories = useMemo(
    () =>
      CategoryService.filterAndSort(categories, {
        searchTerm,
        sortBy: filters.sortBy,
      }),
    [categories, searchTerm, filters.sortBy],
  );

  // Formatted Table Rows
  const tableRows = useMemo(
    () => formatCategoryRows(filteredCategories, filters.page, filters.limit),
    [filteredCategories, filters.page, filters.limit],
  );

  // Active Filter Chips
  const activeChips = useMemo(
    () =>
      CategoryService.formatActiveChips({
        searchTerm,
        sortBy: filters.sortBy,
        onRemoveSearch: () => setSearchTerm(""),
        onRemoveSort: () => setFilters((p) => ({ ...p, sortBy: "" })),
      }),
    [searchTerm, filters.sortBy],
  );

  const activeFilterCount = (filters.sortBy ? 1 : 0) + (searchTerm ? 1 : 0);

  // Drawer Handlers
  const openCreateDrawer = () => setDrawerState({ isOpen: true, data: null });
  const openEditDrawer = (category) =>
    setDrawerState({ isOpen: true, data: category });
  const closeDrawer = () => setDrawerState({ isOpen: false, data: null });

  // Delete Action Handler
  const handleDelete = (category) => {
    deleteData({
      data: category,
      handler: deleteCategoryMutation,
      title: "Delete Category?",
      deleteMsg: `Category "${category?.name || "item"}" deleted successfully`,
    });
  };

  // Action buttons for table rows
  const actions = useMemo(
    () => [
      {
        name: "edit",
        handler: openEditDrawer,
        Icon: RiEdit2Fill,
        disabledOn: [],
      },
      {
        name: "delete",
        handler: handleDelete,
        Icon: MdDelete,
        disabledOn: [],
      },
    ],
    [deleteCategoryMutation],
  );

  return (
    <div className="min-h-screen bg-[#0d0b0a] text-neutral-100 pt-24 sm:pt-28 pb-32 px-4 sm:px-8 md:px-10 lg:px-14 xl:px-16">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* REUSABLE PAGE HEADER */}
        <PageHeader
          breadcrumbs={<CategoryBreadcrumbs />}
          title="Category Management"
          description="Organize bakery collections, treat classifications, and shop navigation menus."
          action={
            <Button
              variant="primary"
              size="md"
              startIcon={FiPlus}
              onClick={openCreateDrawer}
            >
              Add Category
            </Button>
          }
        />

        {/* CATEGORY FILTER COMPONENT */}
        <CategoryFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={filteredCategories.length}
        />

        {/* SHARED LUXURY TABLE */}
        <Table
          isLoading={isLoading || isFetching || isDeleting}
          rows={tableRows}
          columns={CATEGORY_TABLE_COLUMNS}
          actions={actions}
          emptyMessage="No categories found matching your criteria"
          pagination={{
            filters,
            setFilters,
            total: totalCount,
            totalPage: totalPages,
          }}
        />

        {/* FEATURE DRAWER COMPONENT */}
        <CategoryDrawer
          isOpen={drawerState.isOpen}
          onClose={closeDrawer}
          category={drawerState.data}
        />
      </div>
    </div>
  );
}
