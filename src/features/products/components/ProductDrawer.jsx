"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import ProductForm from "./ProductForm";

export default function ProductDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit Product" : "Add New Product";
  const description = editData
    ? "Update bakery product details, inventory, and pricing."
    : "Introduce a handcrafted artisanal treat to your boutique catalog.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="2xl"
    >
      <ProductForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

ProductDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
