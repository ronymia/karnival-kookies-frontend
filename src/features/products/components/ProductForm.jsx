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
  Select,
  RichTextInputField,
  FileUploadInputField,
  ToggleInputField,
  InputError,
  InputLabel,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { useGetCategories } from "@/features/category";
import { useCreateProduct, useUpdateProduct, useUploadProductImages } from "../hooks";
import { productSchema } from "../schema";
import { PRODUCT_UNITS } from "../services";

function ProductFormFields({ editData, onClose, isSubmitting }) {
  const { categories } = useGetCategories({ limit: 100 });
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const isDiscountEnable = watch("is_discount_enable");
  const discountType = watch("discount_type");

  const categoryOptions =
    categories?.map((c) => ({
      value: String(c.id),
      label: c.name,
    })) || [];

  return (
    <>
      <div className="space-y-6">
        {/* PRODUCT NAME */}
        <InputField
          name="name"
          label="Product Name"
          placeholder="e.g. Belgian Triple Chocolate Truffles"
          required
        />

        {/* CATEGORY & UNIT ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            name="category_id"
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            required
          />

          <Select
            name="unit"
            label="Unit of Measurement"
            placeholder="Select unit"
            options={PRODUCT_UNITS}
            required
          />
        </div>

        {/* PRICING & INVENTORY ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="price"
            type="number"
            step="0.01"
            label="Base Price ($)"
            placeholder="0.00"
            required
          />

          <InputField
            name="quantity"
            type="number"
            label="Inventory Stock"
            placeholder="Available units"
            required
          />
        </div>

        {/* DISCOUNT TOGGLE SECTION */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <ToggleInputField
            name="is_discount_enable"
            isNumeric={true}
            label="Enable Promotional Discount"
            description="Apply a special fixed or percentage price reduction"
          />

          {Number(isDiscountEnable) === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
              {/* DISCOUNT TYPE */}
              <div className="flex flex-col gap-1.5 w-full">
                <InputLabel label="Discount Type" required />
                <div className="grid grid-cols-2 gap-2 h-[46px]">
                  <button
                    type="button"
                    onClick={() => setValue("discount_type", "fixed", { shouldValidate: true })}
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
                    onClick={() => setValue("discount_type", "percent", { shouldValidate: true })}
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

              {/* DISCOUNT VALUE */}
              <InputField
                name="discount_value"
                type="number"
                step="0.01"
                label={discountType === "percent" ? "Discount Percentage (%)" : "Discount Amount ($)"}
                placeholder={discountType === "percent" ? "e.g. 15" : "e.g. 5.00"}
                required
              />
            </div>
          )}
        </div>

        {/* DESCRIPTION - RICH TEXT QUILL */}
        <RichTextInputField
          name="description"
          label="Product Description"
          placeholder="Write decadent sensory descriptions for this sweet treat..."
          minHeight="min-h-[140px]"
        />

        {/* IMAGE UPLOAD (HOOK FORM INTEGRATED) */}
        <FileUploadInputField
          name="images"
          label="Product Media Gallery"
          multiple
          accept=".png, .jpg, .jpeg, .webp"
          required
        />
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
          className="min-w-[150px]"
        >
          {editData ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </>
  );
}

ProductFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function ProductForm({ editData = null, onClose }) {
  const [createProduct, { isLoading: isCreating }] = useCreateProduct();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProduct();
  const [uploadImages, { isLoading: isUploading }] = useUploadProductImages();

  const isSubmitting = isCreating || isUpdating || isUploading;

  const defaultValues = {
    name: editData?.name || "",
    price: editData?.price ? Number(editData.price) : "",
    quantity: editData?.quantity !== undefined ? Number(editData.quantity) : 10,
    unit: editData?.unit || "pcs",
    is_discount_enable: editData?.is_discount_enable ? Number(editData.is_discount_enable) : 0,
    discount_type: editData?.discount_type || "fixed",
    discount_value:
      editData?.discount_value !== undefined && editData?.discount_value !== null
        ? Number(editData.discount_value)
        : "",
    category_id:
      editData?.category_id || editData?.category?.id
        ? String(editData.category_id || editData.category?.id)
        : "",
    description: editData?.description || "",
    images: editData?.images || [],
    status: editData?.status || "active",
  };

  const handleSubmit = async (formData) => {
    try {
      const rawImages = formData.images || [];
      const existingImages = [];
      const newFilesToUpload = [];

      rawImages.forEach((img) => {
        if (img instanceof File || img instanceof Blob) {
          newFilesToUpload.push(img);
        } else {
          existingImages.push(img);
        }
      });

      // Upload new files on submit
      let uploadedUrls = [];
      if (newFilesToUpload.length > 0) {
        const uploadResp = await uploadImages(newFilesToUpload).unwrap();
        if (uploadResp?.success && Array.isArray(uploadResp?.data)) {
          uploadedUrls = uploadResp.data;
        }
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      if (finalImages.length === 0) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="error"
            text="Please upload at least one product image."
          />
        ));
        return;
      }

      const payload = {
        ...formData,
        images: finalImages,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        is_discount_enable: Number(formData.is_discount_enable),
        category_id: Number(formData.category_id),
        discount_value:
          Number(formData.is_discount_enable) === 1 && formData.discount_value
            ? Number(formData.discount_value)
            : null,
        discount_type:
          Number(formData.is_discount_enable) === 1
            ? formData.discount_type
            : null,
      };

      if (editData?.id) {
        await updateProduct({ ...payload, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Product updated successfully"
          />
        ));
      } else {
        await createProduct(payload).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Product created successfully"
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
      schema={productSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <ProductFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

ProductForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
