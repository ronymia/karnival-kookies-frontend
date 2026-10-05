"use client";

import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import CategoryForm from "./CategoryForm";

export default function CategoryDrawer({ isOpen, onClose, category = null }) {
  const isEditing = Boolean(category?.id);

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add New Category"}
      subtitle={
        isEditing
          ? "Update category details and bakery menu classification."
          : "Create a new product category for your bakery catalog."
      }
      size="md"
    >
      <CategoryForm editData={category} onClose={onClose} />
    </SlideOverDrawer>
  );
}

CategoryDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  category: PropTypes.object,
};
