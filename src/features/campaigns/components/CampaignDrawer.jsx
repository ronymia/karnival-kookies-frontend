"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import CampaignForm from "./CampaignForm";

export default function CampaignDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit Promotional Campaign" : "Launch New Campaign";
  const description = editData
    ? "Update promotional reward rules, activation triggers, or validity dates."
    : "Design a discount, free cold-packed delivery, BOGO, or gift promotion.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
    >
      <CampaignForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

CampaignDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
