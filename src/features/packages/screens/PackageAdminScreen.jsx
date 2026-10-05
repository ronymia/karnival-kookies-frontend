"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import CustomPopup from "@/components/ui/modal/CustomPopup";
import { deleteData } from "@/helpers/DeleteData";
import {
  PackageBreadcrumbs,
  PackageFilter,
  PackageDrawer,
  PackageViewDrawer,
} from "../components";
import { useGetPackages, useDeletePackage } from "../hooks";
import {
  PackageService,
  PACKAGE_TABLE_COLUMNS,
  formatPackageRows,
} from "../services";

export default function PackageAdminScreen() {
  // Query Hooks
  const { packages, isLoading, isFetching } = useGetPackages({ limit: 100 });
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackage();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    unit: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
    sortBy: "",
  });

  // Drawer & Modal States
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [popupOption, setPopupOption] = useState({
    open: false,
    type: "",
    title: "",
    files: [],
    fileFolder: "Products",
    closeOnDocumentClick: false,
    onClose: () => {
      setPopupOption((prev) => ({ ...prev, open: false, files: [] }));
    },
  });

  // Drawer Handlers
  const handleOpenCreate = () => {
    setSelectedPackage(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setSelectedPackage(pkg);
    setIsFormDrawerOpen(true);
  };

  const handleOpenView = (pkg) => {
    setSelectedPackage(pkg);
    setIsViewDrawerOpen(true);
  };

  const handleViewImages = (images = []) => {
    if (!images || images.length === 0) return;
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewFile",
      title: "Package Image Gallery",
      files: images.map((img) =>
        typeof img === "object" ? img?.file || img : img
      ),
      fileFolder: "Products",
      onClose: () => {
        setPopupOption({
          ...popupOption,
          open: false,
          files: [],
        });
      },
      closeOnDocumentClick: false,
    });
  };

  const handleDelete = (pkg) => {
    deleteData({
      handler: deletePackage,
      data: pkg,
      deleteMsg: `Package "${pkg?.name}" deleted successfully.`,
    });
  };

  // Client-Side Sort & Filter
  const displayPackages = useMemo(() => {
    return PackageService.filterAndSort(packages, {
      searchTerm,
      unit: filters.unit,
      status: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minQuantity: filters.minQuantity,
      maxQuantity: filters.maxQuantity,
      sortBy: filters.sortBy,
    });
  }, [
    packages,
    searchTerm,
    filters.unit,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.minQuantity,
    filters.maxQuantity,
    filters.sortBy,
  ]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatPackageRows(
      displayPackages,
      filters.page,
      filters.limit,
      handleViewImages
    );
  }, [displayPackages, filters.page, filters.limit]);

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
    return PackageService.formatActiveChips({
      searchTerm,
      unit: filters.unit,
      status: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minQuantity: filters.minQuantity,
      maxQuantity: filters.maxQuantity,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveUnit: () =>
        setFilters((prev) => ({ ...prev, unit: "", page: 1 })),
      onRemoveStatus: () =>
        setFilters((prev) => ({ ...prev, status: "", page: 1 })),
      onRemovePriceRange: () =>
        setFilters((prev) => ({
          ...prev,
          minPrice: "",
          maxPrice: "",
          page: 1,
        })),
      onRemoveQuantityRange: () =>
        setFilters((prev) => ({
          ...prev,
          minQuantity: "",
          maxQuantity: "",
          page: 1,
        })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [
    searchTerm,
    filters.unit,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.minQuantity,
    filters.maxQuantity,
    filters.sortBy,
  ]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* POPUP / MODALS (FULL IMAGE GALLERY) */}
      <CustomPopup popupOption={popupOption} setPopupOption={setPopupOption} />

      {/* CREATE / EDIT SLIDE-OVER DRAWER */}
      <PackageDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setSelectedPackage(null);
        }}
        editData={selectedPackage}
      />

      {/* VIEW DETAILS SLIDE-OVER DRAWER */}
      <PackageViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedPackage(null);
        }}
        data={selectedPackage}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <PackageBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Combo Package Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Curate gourmet holiday baskets, artisanal sweet bundles, and custom combo assortments.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={handleOpenCreate}
            className="shrink-0 self-start sm:self-auto shadow-lg shadow-primary/20"
          >
            Add Combo Package
          </Button>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <PackageFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayPackages.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayPackages.length}
              </strong>{" "}
              {displayPackages.length === 1 ? "combo package" : "combo packages"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching || isDeleting}
            rows={tableRows}
            columns={PACKAGE_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayPackages.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
