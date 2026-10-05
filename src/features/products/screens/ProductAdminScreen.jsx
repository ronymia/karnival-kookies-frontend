"use client";

import React, { useState, useMemo } from "react";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { PageHeader } from "@/components/ui/heading";
import { Button } from "@/components/ui/buttons";
import { Table } from "@/components/ui/table";
import { usePopupContext } from "@/hooks/usePopupContext";
import { deleteData } from "@/helpers/DeleteData";
import { useGetCategories } from "@/features/category";
import {
  ProductBreadcrumbs,
  ProductFilter,
  ProductDrawer,
  ProductViewDrawer,
} from "../components";
import { useGetProducts, useDeleteProduct } from "../hooks";
import {
  ProductService,
  PRODUCT_TABLE_COLUMNS,
  formatProductRows,
} from "../services";

export default function ProductAdminScreen() {
  // Query & Mutation Hooks
  const [filters, setFilters] = useState(ProductService.getDefaultFilters());
  const [searchTerm, setSearchTerm] = useState("");
  const { products, totalCount, isLoading, isFetching } = useGetProducts({
    page: filters.page,
    limit: filters.limit,
  });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProduct();
  const { categories } = useGetCategories({ limit: 100 });

  // Modal / Drawer Local States
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Global Popup Context (for bulk image gallery viewer)
  const { popupOption, setPopupOption } = usePopupContext();

  // Handlers
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsFormDrawerOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsFormDrawerOpen(true);
  };

  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setIsViewDrawerOpen(true);
  };

  const handleViewImages = (images = []) => {
    if (!images || images.length === 0) return;
    setPopupOption({
      ...popupOption,
      open: true,
      type: "viewFile",
      title: "Product Image Gallery",
      files: images.map((img) => (typeof img === "object" ? img?.file || img : img)),
      fileFolder: "Products",
      onClose: () => {
        setPopupOption({
          ...popupOption,
          open: false,
          files: "",
          fileFolder: "",
        });
      },
      closeOnDocumentClick: false,
    });
  };

  const handleDelete = (product) => {
    deleteData({
      handler: deleteProduct,
      data: product,
      deleteMsg: `Product "${product?.name}" deleted successfully.`,
    });
  };

  // Client-side Sort & Filter Derivation (Name-only search, category, unit, status, price range, quantity range, sort)
  const displayProducts = useMemo(() => {
    return ProductService.filterAndSort(products, {
      searchTerm,
      categoryId: filters.category_id,
      unit: filters.unit,
      status: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minQuantity: filters.minQuantity,
      maxQuantity: filters.maxQuantity,
      sortBy: filters.sortBy,
    });
  }, [
    products,
    searchTerm,
    filters.category_id,
    filters.unit,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.minQuantity,
    filters.maxQuantity,
    filters.sortBy,
  ]);

  // Derived Table Rows
  const tableRows = useMemo(() => {
    return formatProductRows(
      displayProducts,
      filters.page,
      filters.limit,
      handleViewImages
    );
  }, [displayProducts, filters.page, filters.limit]);

  // Row Action Buttons
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
  const selectedCategoryObj = categories?.find(
    (c) => String(c.id) === String(filters.category_id)
  );

  const activeChips = useMemo(() => {
    return ProductService.formatActiveChips({
      searchTerm,
      categoryName: selectedCategoryObj?.name || "",
      unit: filters.unit,
      status: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minQuantity: filters.minQuantity,
      maxQuantity: filters.maxQuantity,
      sortBy: filters.sortBy,
      onRemoveSearch: () => setSearchTerm(""),
      onRemoveCategory: () =>
        setFilters((prev) => ({ ...prev, category_id: "", page: 1 })),
      onRemoveUnit: () =>
        setFilters((prev) => ({ ...prev, unit: "", page: 1 })),
      onRemoveStatus: () =>
        setFilters((prev) => ({ ...prev, status: "", page: 1 })),
      onRemovePriceRange: () =>
        setFilters((prev) => ({ ...prev, minPrice: "", maxPrice: "", page: 1 })),
      onRemoveQuantityRange: () =>
        setFilters((prev) => ({ ...prev, minQuantity: "", maxQuantity: "", page: 1 })),
      onRemoveSort: () =>
        setFilters((prev) => ({ ...prev, sortBy: "", page: 1 })),
    });
  }, [
    searchTerm,
    selectedCategoryObj,
    filters.unit,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.minQuantity,
    filters.maxQuantity,
    filters.sortBy,
  ]);

  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (filters.category_id ? 1 : 0) +
    (filters.unit ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.minQuantity || filters.maxQuantity ? 1 : 0) +
    (filters.sortBy ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 pt-32">
      {/* PAGE HEADER */}
      <PageHeader
        title="Product Management"
        description="Manage gourmet sweet treats, inventory levels, promotional pricing, and category assignments."
        breadcrumbs={<ProductBreadcrumbs />}
        action={
          <Button
            variant="primary"
            size="md"
            startIcon={FiPlus}
            onClick={handleOpenCreate}
          >
            Add Product
          </Button>
        }
      />

      {/* FILTER & SEARCH PANEL */}
      <ProductFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        activeChips={activeChips}
        activeFilterCount={activeFilterCount}
        totalItems={displayProducts.length}
      />

      {/* PRODUCTS TABLE */}
      <div className="space-y-6">
        <Table
          isLoading={isLoading || isFetching || isDeleting}
          rows={tableRows}
          actions={tableActions}
          columns={PRODUCT_TABLE_COLUMNS}
          pagination={{
            filters,
            setFilters,
            total: totalCount,
          }}
        />
      </div>

      {/* SLIDE-OVER FORM DRAWER (CREATE / EDIT) */}
      <ProductDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => setIsFormDrawerOpen(false)}
        editData={selectedProduct}
      />

      {/* SLIDE-OVER VIEW DRAWER */}
      <ProductViewDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        product={selectedProduct}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}
