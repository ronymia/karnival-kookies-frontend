"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import { deleteData } from "@/helpers/DeleteData";
import {
  MetaDataBreadcrumbs,
  MetaDataFilter,
  MetaDataDrawer,
  MetaDataViewDrawer,
} from "../components";
import { useGetAllMetaData, useDeleteMetaData } from "../hooks";
import {
  MetaDataService,
  META_DATA_TABLE_COLUMNS,
  formatMetaDataRows,
} from "../services";

export default function MetaDataAdminScreen() {
  // Query Hooks
  const { metaDataList, isLoading, isFetching } = useGetAllMetaData();
  const [deleteMetaData, { isLoading: isDeleting }] = useDeleteMetaData();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    meta_key: "",
    sortBy: "",
  });

  // Drawer States
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedMetaData, setSelectedMetaData] = useState(null);

  const handleOpenCreate = () => {
    setSelectedMetaData(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedMetaData(item);
    setIsFormDrawerOpen(true);
  };

  const handleOpenView = (item) => {
    setSelectedMetaData(item);
    setIsViewDrawerOpen(true);
  };

  const handleDelete = (item) => {
    deleteData({
      handler: deleteMetaData,
      data: item,
      deleteMsg: `Meta data for "${MetaDataService.formatMetaKey(item?.meta_key)}" deleted successfully.`,
    });
  };

  // Client-Side Sort & Filter
  const displayMetaData = useMemo(() => {
    return MetaDataService.filterAndSort(metaDataList, {
      searchTerm,
      meta_key: filters.meta_key,
      sortBy: filters.sortBy,
    });
  }, [metaDataList, searchTerm, filters.meta_key, filters.sortBy]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatMetaDataRows(displayMetaData, filters.page, filters.limit);
  }, [displayMetaData, filters.page, filters.limit]);

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
      {
        name: "delete",
        handler: handleDelete,
        Icon: FiTrash2,
        disabledOn: [],
      },
    ],
    []
  );

  // Active Filter Chips
  const activeChips = useMemo(() => {
    return MetaDataService.formatActiveChips({
      searchTerm,
      meta_key: filters.meta_key,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveKey: () =>
        setFilters((prev) => ({ ...prev, meta_key: "", page: 1 })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [searchTerm, filters.meta_key, filters.sortBy]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* CREATE / EDIT SLIDE-OVER DRAWER */}
      <MetaDataDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setSelectedMetaData(null);
        }}
        editData={selectedMetaData}
      />

      {/* VIEW DETAILS SLIDE-OVER DRAWER (SERP PREVIEW) */}
      <MetaDataViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedMetaData(null);
        }}
        data={selectedMetaData}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <MetaDataBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              SEO Meta Data Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Optimize search engine visibility, social sharing graph cards, and SERP snippets for application routes.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={handleOpenCreate}
            className="shrink-0 self-start sm:self-auto shadow-lg shadow-primary/20"
          >
            Add Meta Data
          </Button>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <MetaDataFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayMetaData.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayMetaData.length}
              </strong>{" "}
              {displayMetaData.length === 1 ? "page record" : "page records"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching || isDeleting}
            rows={tableRows}
            columns={META_DATA_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayMetaData.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
