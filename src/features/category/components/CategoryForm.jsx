"use client";

import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { errorHandler } from "@/helpers/errorHandler";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { CustomForm, InputField, TextareaInputField } from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { useCreateCategory, useUpdateCategory } from "../hooks";
import { categorySchema } from "../schema";

export default function CategoryForm({ editData = null, onClose }) {
  const [createCategory, { isLoading: isCreating }] = useCreateCategory();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategory();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    name: editData?.name || "",
    description: editData?.description || "",
  };

  const handleSubmit = async (data) => {
    try {
      if (editData?.id) {
        await updateCategory({ ...data, id: editData.id }).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Category updated successfully"
          />
        ));
      } else {
        await createCategory(data).unwrap();
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="Category added successfully"
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
      schema={categorySchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
      className="flex flex-col h-full justify-between gap-6"
    >
      <div className="space-y-5">
        <InputField
          name="name"
          label="Category Name"
          placeholder="e.g. Artisanal Cookies"
          helperText="Unique name for menu navigation and shop filters."
          required
        />

        <TextareaInputField
          name="description"
          label="Description"
          placeholder="Brief description of treats in this category..."
          rows={5}
          helperText="Optional summary shown to customers on shop cards."
        />
      </div>

      {/* STICKY BOTTOM ACTION BUTTONS */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3 mt-auto">
        <Button
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
          {editData ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </CustomForm>
  );
}

CategoryForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
