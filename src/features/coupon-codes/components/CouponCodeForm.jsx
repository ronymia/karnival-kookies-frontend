"use client";

import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import {
  CustomForm,
  InputField,
  InputLabel,
  InputError,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { useCreateCouponCode, useUpdateCouponCode } from "../hooks";
import { couponCodeSchema } from "../schema";

function CouponCodeFormFields({ editData, onClose, isSubmitting }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const discountType = watch("discount_type");

  return (
    <>
      <div className="space-y-6">
        {/* COUPON CODE */}
        <InputField
          name="code"
          label="Coupon Code"
          placeholder="e.g. SWEET20 or HOLIDAY50"
          helperText="Unique uppercase alphanumeric promo code applied during checkout"
          required
        />

        {/* DISCOUNT TYPE */}
        <div className="flex flex-col gap-1.5 w-full">
          <InputLabel label="Discount Type" required />
          <div className="grid grid-cols-2 gap-2 h-[46px]">
            <button
              type="button"
              onClick={() =>
                setValue("discount_type", "fixed", { shouldValidate: true })
              }
              className={`h-full px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                discountType === "fixed"
                  ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/20"
                  : "bg-[#151312] border-primary/25 text-neutral-300 hover:border-primary/45 hover:bg-white/5"
              }`}
            >
              Fixed Amount ($)
            </button>
            <button
              type="button"
              onClick={() =>
                setValue("discount_type", "percent", { shouldValidate: true })
              }
              className={`h-full px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                discountType === "percent"
                  ? "bg-primary text-black border-primary font-bold shadow-md shadow-primary/20"
                  : "bg-[#151312] border-primary/25 text-neutral-300 hover:border-primary/45 hover:bg-white/5"
              }`}
            >
              Percentage (%)
            </button>
          </div>
          {errors?.discount_type?.message && (
            <InputError error={errors.discount_type.message} />
          )}
        </div>

        {/* DISCOUNT VALUE & MINIMUM SPEND ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="discount_value"
            type="number"
            step="0.01"
            label={
              discountType === "percent"
                ? "Discount Percentage (%)"
                : "Discount Amount ($)"
            }
            placeholder={discountType === "percent" ? "e.g. 20" : "e.g. 5.00"}
            required
          />

          <InputField
            name="minimum_spend"
            type="number"
            step="0.01"
            label="Minimum Cart Spend ($)"
            placeholder="0.00 (No Minimum)"
            helperText="Set to 0 if valid for any order total"
            required
          />
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
          {editData ? "Save Changes" : "Create Coupon"}
        </Button>
      </div>
    </>
  );
}

CouponCodeFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function CouponCodeForm({ editData = null, onClose }) {
  const [createCouponCode, { isLoading: isCreating }] = useCreateCouponCode();
  const [updateCouponCode, { isLoading: isUpdating }] = useUpdateCouponCode();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    code: editData?.code ? String(editData.code).toUpperCase() : "",
    discount_type: editData?.discount_type || "fixed",
    discount_value:
      editData?.discount_value !== undefined && editData?.discount_value !== null
        ? Number(editData.discount_value)
        : "",
    minimum_spend:
      editData?.minimum_spend !== undefined && editData?.minimum_spend !== null
        ? Number(editData.minimum_spend)
        : 0,
    status: editData?.status || "active",
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discount_value: Number(formData.discount_value),
        minimum_spend: Number(formData.minimum_spend) || 0,
      };

      if (editData?.id) {
        await updateCouponCode({ ...payload, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Coupon code updated successfully"
          />
        ));
      } else {
        await createCouponCode(payload).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Coupon code created successfully"
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
      schema={couponCodeSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <CouponCodeFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

CouponCodeForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
