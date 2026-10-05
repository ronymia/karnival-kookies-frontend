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
  TextareaInputField,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { FiGlobe } from "react-icons/fi";
import { useCreateMetaData, useUpdateMetaData } from "../hooks";
import { metaDataSchema } from "../schema";
import { META_KEYS } from "../services";

function MetaDataFormFields({ editData, onClose, isSubmitting }) {
  const { watch } = useFormContext();

  const currentTitle = watch("title") || "Page Title | Karnival Kookies";
  const currentDesc =
    watch("description") ||
    "Experience artisanal handcrafted cookies, rich gooey brownies, and luxury holiday gift crates baked fresh daily.";
  const currentKey = watch("meta_key") || "home_page";

  return (
    <>
      <div className="space-y-6">
        {/* TARGET PAGE SELECT */}
        <Select
          name="meta_key"
          label="Target Application Route / Page"
          placeholder="Select route"
          options={META_KEYS}
          isSearchable
          required
        />

        {/* SEO TITLE */}
        <InputField
          name="title"
          label="SEO Meta Title"
          placeholder="e.g. Gourmet Handcrafted Cookies & Brownies | Karnival Kookies"
          helperText="Recommended: 50-60 characters for optimal search result display"
          required
        />

        {/* META DESCRIPTION */}
        <TextareaInputField
          name="description"
          label="Meta Search Description"
          placeholder="Describe page contents, offerings, and value proposition for search engines..."
          helperText="Recommended: 120-160 characters"
          rows={4}
          required
        />

        {/* LIVE GOOGLE SERP SNIPPET PREVIEW CARD */}
        <div className="p-4 rounded-2xl bg-[#12100e] border border-white/10 space-y-2.5 shadow-inner">
          <div className="flex items-center gap-2 text-primary text-[11px] font-semibold uppercase tracking-wider">
            <FiGlobe className="text-xs" />
            <span>Live Google Search Engine Snippet Preview</span>
          </div>

          <div className="space-y-1 bg-black/40 p-3.5 rounded-xl border border-white/5 font-sans">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="text-emerald-400 font-medium">
                https://karnivalkookies.com
              </span>
              <span>›</span>
              <span className="text-neutral-300 font-mono text-[11px]">
                {currentKey}
              </span>
            </div>

            <h4 className="text-blue-400 hover:underline text-sm sm:text-base font-medium leading-snug cursor-pointer line-clamp-1">
              {currentTitle}
            </h4>

            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {currentDesc}
            </p>
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
          {editData ? "Save Changes" : "Save Meta Data"}
        </Button>
      </div>
    </>
  );
}

MetaDataFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function MetaDataForm({ editData = null, onClose }) {
  const [createMetaData, { isLoading: isCreating }] = useCreateMetaData();
  const [updateMetaData, { isLoading: isUpdating }] = useUpdateMetaData();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    meta_key: editData?.meta_key || "",
    title: editData?.title || "",
    description: editData?.description || "",
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData?.id) {
        await updateMetaData({ ...formData, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Meta data updated successfully"
          />
        ));
      } else {
        await createMetaData(formData).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Meta data created successfully"
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
      schema={metaDataSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <MetaDataFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

MetaDataForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
