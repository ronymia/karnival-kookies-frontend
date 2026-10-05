"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/buttons";
import Table from "@/components/ui/table/Table";
import { deleteData } from "@/helpers/DeleteData";
import {
  FaqBreadcrumbs,
  FaqFilter,
  FaqDrawer,
  FaqViewDrawer,
} from "../components";
import { useGetFaqs, useDeleteFaq } from "../hooks";
import {
  FaqService,
  FAQ_TABLE_COLUMNS,
  formatFaqRows,
} from "../services";

export default function FaqAdminScreen() {
  // Query Hooks
  const { faqs, isLoading, isFetching } = useGetFaqs({ limit: 100 });
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaq();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
  });

  // Drawer States
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const handleOpenCreate = () => {
    setSelectedFaq(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setSelectedFaq(faq);
    setIsFormDrawerOpen(true);
  };

  const handleOpenView = (faq) => {
    setSelectedFaq(faq);
    setIsViewDrawerOpen(true);
  };

  const handleDelete = (faq) => {
    deleteData({
      handler: deleteFaq,
      data: faq,
      deleteMsg: "FAQ item deleted successfully.",
    });
  };

  // Client-Side Sort & Filter
  const displayFaqs = useMemo(() => {
    return FaqService.filterAndSort(faqs, {
      searchTerm,
      sortBy: filters.sortBy,
    });
  }, [faqs, searchTerm, filters.sortBy]);

  // Table Data Formatting
  const tableRows = useMemo(() => {
    return formatFaqRows(displayFaqs, filters.page, filters.limit);
  }, [displayFaqs, filters.page, filters.limit]);

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
    return FaqService.formatActiveChips({
      searchTerm,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [searchTerm, filters.sortBy]);

  const activeFilterCount = activeChips.length;

  return (
    <>
      {/* CREATE / EDIT SLIDE-OVER DRAWER */}
      <FaqDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setSelectedFaq(null);
        }}
        editData={selectedFaq}
      />

      {/* VIEW DETAILS SLIDE-OVER DRAWER */}
      <FaqViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false);
          setSelectedFaq(null);
        }}
        data={selectedFaq}
      />

      {/* MAIN SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* BREADCRUMB NAVIGATION */}
        <FaqBreadcrumbs />

        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Manage helpful answers regarding artisanal cookie ingredients, allergen warnings, packaging, and deliveries.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={FiPlus}
            onClick={handleOpenCreate}
            className="shrink-0 self-start sm:self-auto shadow-lg shadow-primary/20"
          >
            Add FAQ
          </Button>
        </div>

        {/* SEARCH, FILTER & SORT PANEL */}
        <FaqFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          activeChips={activeChips}
          activeFilterCount={activeFilterCount}
          totalItems={displayFaqs.length}
        />

        {/* DATA TABLE SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-neutral-400 font-medium">
              Showing{" "}
              <strong className="text-white">
                {displayFaqs.length}
              </strong>{" "}
              {displayFaqs.length === 1 ? "FAQ" : "FAQs"}
            </p>
          </div>

          <Table
            isLoading={isLoading || isFetching || isDeleting}
            rows={tableRows}
            columns={FAQ_TABLE_COLUMNS}
            actions={tableActions}
            pagination={{
              filters,
              setFilters,
              total: displayFaqs.length,
            }}
          />
        </div>
      </div>
    </>
  );
}
