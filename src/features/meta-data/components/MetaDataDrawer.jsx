"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import MetaDataForm from "./MetaDataForm";

export default function MetaDataDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit SEO Meta Data" : "Add Page Meta Data";
  const description = editData
    ? "Configure SEO search engine titles, social graph tags, and meta descriptions."
    : "Define targeted search engine meta titles and descriptions for website routes.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
    >
      <MetaDataForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

MetaDataDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
