"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import FaqForm from "./FaqForm";

export default function FaqDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit FAQ Item" : "Create New FAQ Item";
  const description = editData
    ? "Update customer question phrasing and detailed rich answer response."
    : "Publish helpful answers to frequently asked bakery, ordering, and shipping questions.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
    >
      <FaqForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

FaqDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
