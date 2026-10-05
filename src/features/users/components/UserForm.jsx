"use client";

import React from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import {
  CustomForm,
  InputField,
  Select,
  PasswordInputField,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { FiUser, FiMapPin, FiShield } from "react-icons/fi";
import { useCreateUser, useUpdateUser } from "../hooks";
import { userSchema } from "../schema";
import { USER_ROLES, GENDER_OPTIONS } from "../services";

function UserFormFields({ editData, onClose, isSubmitting }) {
  const isEditing = Boolean(editData?.id);

  return (
    <>
      <div className="space-y-8">
        {/* SECTION 1: ACCOUNT & PERSONAL INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider border-b border-white/10 pb-2">
            <FiUser className="text-sm" />
            <span>Personal & Account Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FULL NAME */}
            <InputField
              name="name"
              label="Full Name"
              placeholder="e.g. Eleanor Vance"
              required
            />

            {/* EMAIL */}
            <InputField
              name="email"
              type="email"
              label="Email Address"
              placeholder="e.g. eleanor@example.com"
              disabled={isEditing}
              required
            />

            {/* PHONE */}
            <InputField
              name="phone"
              type="tel"
              label="Phone Number"
              placeholder="e.g. +1 (555) 234-5678"
              required
            />

            {/* ROLE */}
            <Select
              name="role"
              label="System Role"
              placeholder="Select assigned role"
              options={USER_ROLES}
              isSearchable
              required
            />

            {/* GENDER */}
            <Select
              name="gender"
              label="Gender"
              placeholder="Select gender (optional)"
              options={GENDER_OPTIONS}
              isClearable
            />

            {/* DATE OF BIRTH */}
            <InputField
              name="date_of_birth"
              type="date"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
            />
          </div>
        </div>

        {/* SECTION 2: ADDRESS & LOCATION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider border-b border-white/10 pb-2">
            <FiMapPin className="text-sm" />
            <span>Delivery & Billing Address</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* STREET ADDRESS */}
            <div className="sm:col-span-2">
              <InputField
                name="address"
                label="Street Address"
                placeholder="e.g. 742 Evergreen Terrace, Suite 4B"
              />
            </div>

            {/* CITY */}
            <InputField
              name="city"
              label="City"
              placeholder="e.g. Springfield"
            />

            {/* COUNTRY */}
            <InputField
              name="country"
              label="Country"
              placeholder="e.g. United States"
            />

            {/* POSTCODE */}
            <InputField
              name="postcode"
              label="Postal Code / Zip"
              placeholder="e.g. 97477"
            />
          </div>
        </div>

        {/* SECTION 3: SECURITY & PASSWORD */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider border-b border-white/10 pb-2">
            <FiShield className="text-sm" />
            <span>Security Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <PasswordInputField
                name="password"
                label={isEditing ? "Change Password (Optional)" : "Account Password"}
                placeholder={
                  isEditing
                    ? "Leave blank to keep existing password"
                    : "Min 8 chars, uppercase, lowercase & numbers"
                }
                helperText={
                  isEditing
                    ? "Enter a new password only if you wish to reset it"
                    : "Must include at least 1 uppercase letter, 1 lowercase letter, and 1 number"
                }
                required={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR */}
      <div className="pt-6 pb-6 border-t border-white/10 flex items-center justify-end gap-3 mt-auto">
        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          className="min-w-[140px]"
        >
          {isEditing ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </>
  );
}

UserFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function UserForm({ editData = null, onClose }) {
  const [createUser, { isLoading: isCreating }] = useCreateUser();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUser();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    name: editData?.profile?.name || editData?.name || "",
    email: editData?.email || "",
    phone: editData?.profile?.phone || editData?.phone || "",
    role: editData?.role || "customer",
    gender: editData?.profile?.gender || null,
    date_of_birth: editData?.profile?.date_of_birth || "",
    address: editData?.profile?.address || "",
    city: editData?.profile?.city || "",
    country: editData?.profile?.country || "",
    postcode: editData?.profile?.postcode || "",
    password: "",
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postcode: formData.postcode,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editData?.id) {
        await updateUser({ ...payload, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="User account updated successfully"
          />
        ));
      } else {
        await createUser(payload).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="User account created successfully"
          />
        ));
      }

      onClose?.();
    } catch (err) {
      errorHandler({ err });
      throw err;
    }
  };

  return (
    <CustomForm
      schema={userSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <UserFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

UserForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
