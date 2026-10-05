"use client";

import React from "react";
import PropTypes from "prop-types";
import { SlideOverDrawer } from "@/components/ui/drawer";
import UserForm from "./UserForm";

export default function UserDrawer({ isOpen, onClose, editData = null }) {
  const isEditing = Boolean(editData?.id);
  const title = isEditing ? "Edit User Account" : "Add New User Account";
  const description = isEditing
    ? "Update user profile information, contact numbers, and assigned permissions."
    : "Register a staff administrator, team manager, or customer account.";

  return (
    <SlideOverDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="2xl"
    >
      <UserForm editData={editData} onClose={onClose} />
    </SlideOverDrawer>
  );
}

UserDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editData: PropTypes.object,
};
