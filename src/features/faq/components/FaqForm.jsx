"use client";

import React from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import {
  CustomForm,
  InputField,
  RichTextInputField,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { useCreateFaq, useUpdateFaq } from "../hooks";
import { faqSchema } from "../schema";

function FaqFormFields({ editData, onClose, isSubmitting }) {
  return (
    <>
      <div className="space-y-6">
        {/* QUESTION */}
        <InputField
          name="question"
          label="FAQ Question"
          placeholder="e.g. Do you offer nationwide shipping for gift boxes?"
          helperText="Write a clear, concise question that customers frequently ask"
          required
        />

        {/* DETAILED ANSWER - RICH TEXT QUILL */}
        <RichTextInputField
          name="answer"
          label="Detailed Answer"
          placeholder="Provide a comprehensive, helpful response..."
          minHeight="min-h-[160px]"
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
          className="min-w-[140px]"
        >
          {editData ? "Save Changes" : "Create FAQ"}
        </Button>
      </div>
    </>
  );
}

FaqFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function FaqForm({ editData = null, onClose }) {
  const [createFaq, { isLoading: isCreating }] = useCreateFaq();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaq();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    question: editData?.question || "",
    answer: editData?.answer || "",
  };

  const handleSubmit = async (formData) => {
    try {
      if (editData?.id) {
        await updateFaq({ ...formData, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="FAQ updated successfully"
          />
        ));
      } else {
        await createFaq(formData).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="FAQ created successfully"
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
      schema={faqSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <FaqFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

FaqForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
