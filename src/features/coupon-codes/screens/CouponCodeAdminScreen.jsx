"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import { deleteData } from "@/helpers/DeleteData";
import {
  CouponCodeBreadcrumbs,
  CouponCodeFilter,
  CouponCodeDrawer,
} from "../components";
import { useGetCouponCodes, useDeleteCouponCode } from "../hooks";
import {
  CouponCodeService,
  COUPON_CODE_TABLE_COLUMNS,
  formatCouponCodeRows,
} from "../services";

export default function CouponCodeAdminScreen() {
  // Query Hooks
  const { couponCodes, isLoading, isFetching } = useGetCouponCodes({
    limit: 100,
  });
  const [deleteCouponCode, { isLoading: isDeleting }] = useDeleteCouponCode();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    discount_type: "",
    minDiscount: "",
    maxDiscount: "",
    sortBy: "",
  });

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCoupon(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDrawerOpen(true);
  };

  const handleDelete = (coupon) => {
    deleteData({
      handler: deleteCouponCode,
      data: { id: coupon?.id, title: "Coupon" },
      deleteMsg: `Coupon code "${coupon?.code}" deleted successfully.`,
    });
  };

  // Client-Side Sort & Filter
  const displayCoupons = useMemo(() => {
    return CouponCodeService.filterAndSort(couponCodes, {
      searchTerm,
      discount_type: filters.discount_type,
      minDiscount: filters.minDiscount,
      maxDiscount: filters.maxDiscount,
      sortBy: filters.sortBy,
    });
  }, [
    couponCodes,
    searchTerm,
    filters.discount_type,
    filters.minDiscount,
    filters.maxDiscount,
    filters.sortBy,
  ]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatCouponCodeRows(
      displayCoupons,
      filters.page,
      filters.limit
    );
  }, [displayCoupons, filters.page, filters.limit]);

  // Table Actions
  const tableActions = useMemo(
    () => [
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
    return CouponCodeService.formatActiveChips({
      searchTerm,
      discount_type: filters.discount_type,
      minDiscount: filters.minDiscount,
      maxDiscount: filters.maxDiscount,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveType: () =>
        setFilters((prev) => ({ ...prev, discount_type: "", page: 1 })),
      onRemoveDiscountRange: () =>
        setFilters((prev) => ({
          ...prev,
          minDiscount: "",
          maxDiscount: "",
          page: 1,
        })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [
    searchTerm,
    filters.discount_type,
    filters.minDiscount,
    filters.maxDiscount,
    filters.sortBy,
  ]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* CREATE / EDIT SLIDE-OVER DRAWER */}
      <CouponCodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCoupon(null);
        }}
        editData={selectedCoupon}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <CouponCodeBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Coupon Code Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Create and manage promotional discount codes, fixed rate reductions, and minimum spend rules.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={handleOpenCreate}
            className="shrink-0 self-start sm:self-auto shadow-lg shadow-primary/20"
          >
            Add Coupon Code
          </Button>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <CouponCodeFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayCoupons.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayCoupons.length}
              </strong>{" "}
              {displayCoupons.length === 1 ? "coupon code" : "coupon codes"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching || isDeleting}
            rows={tableRows}
            columns={COUPON_CODE_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayCoupons.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
