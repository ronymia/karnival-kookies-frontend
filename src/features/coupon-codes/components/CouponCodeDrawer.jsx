"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import CouponCodeForm from "./CouponCodeForm";

export default function CouponCodeDrawer({ isOpen, onClose, editData = null }) {
  const title = editData ? "Edit Coupon Code" : "Create New Coupon Code";
  const description = editData
    ? "Update promotional discount rules, minimum order spend, or discount rate."
    : "Create a promotional discount code for customer checkout discounts.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="xl"
    >
      <CouponCodeForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

CouponCodeDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
