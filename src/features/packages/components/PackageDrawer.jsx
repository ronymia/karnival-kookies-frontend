"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import PackageForm from "./PackageForm";

export default function PackageDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit Combo Package" : "Add New Combo Package";
  const description = editData
    ? "Update package pricing, inventory, discount rules, and contents."
    : "Curate a gourmet gift basket or artisanal combo package for your patrons.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="2xl"
    >
      <PackageForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

PackageDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
