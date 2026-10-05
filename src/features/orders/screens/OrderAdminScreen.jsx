"use client";

import React, { useState, useMemo } from "react";
import { FiEye } from "react-icons/fi";
import Table from "@/components/ui/table/Table";
import {
  OrderBreadcrumbs,
  OrderFilter,
  OrderStatusModal,
  OrderViewDrawer,
} from "../components";
import { useGetAllOrders } from "../hooks";
import {
  OrderService,
  ORDER_TABLE_COLUMNS,
  formatOrderRows,
} from "../services";

export default function OrderAdminScreen() {
  // Query Hooks
  const { orders, isLoading, isFetching } = useGetAllOrders({ limit: 100 });

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    payment_method: "",
    sortBy: "",
  });

  // Drawer / Modal States
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenView = (order) => {
    setSelectedOrder(order);
    setIsViewDrawerOpen(true);
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  // Client-Side Sort & Filter
  const displayOrders = useMemo(() => {
    return OrderService.filterAndSort(orders, {
      searchTerm,
      status: filters.status,
      payment_method: filters.payment_method,
      sortBy: filters.sortBy,
    });
  }, [orders, searchTerm, filters.status, filters.payment_method, filters.sortBy]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatOrderRows(
      displayOrders,
      filters.page,
      filters.limit,
      handleOpenStatusModal
    );
  }, [displayOrders, filters.page, filters.limit]);

  // Table Actions
  const tableActions = useMemo(
    () => [
      {
        name: "view",
        handler: handleOpenView,
        Icon: FiEye,
        disabledOn: [],
      },
    ],
    []
  );

  // Active Filter Chips
  const activeChips = useMemo(() => {
    return OrderService.formatActiveChips({
      searchTerm,
      status: filters.status,
      payment_method: filters.payment_method,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveStatus: () =>
        setFilters((prev) => ({ ...prev, status: "", page: 1 })),
      onRemovePaymentMethod: () =>
        setFilters((prev) => ({ ...prev, payment_method: "", page: 1 })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [searchTerm, filters.status, filters.payment_method, filters.sortBy]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* QUICK STATUS TRANSITION MODAL */}
      <OrderStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      {/* VIEW ORDER DETAILS SLIDE-OVER DRAWER */}
      <OrderViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedOrder(null);
        }}
        data={selectedOrder}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <OrderBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Order Fulfillment & Management
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Track customer bakery purchases, update delivery progress, and monitor shipping destinations.
            </p>
          </div>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <OrderFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayOrders.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayOrders.length}
              </strong>{" "}
              {displayOrders.length === 1 ? "order" : "orders"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching}
            rows={tableRows}
            columns={ORDER_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayOrders.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
