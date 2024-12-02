"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { useState } from "react";
import toast from "react-hot-toast";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomField from "@/Shared/Fields/CustomField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/apis/categoryApis";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";

export default function CategoryForm() {
  const { popupOption } = usePopupContext();

  const [createCategory, createResult] = useCreateCategoryMutation();
  const [updateCategory, updateResult] = useUpdateCategoryMutation();

  //
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    name: popupOption?.data ? popupOption?.data?.name : "",
    description: popupOption?.data ? popupOption?.data?.description : "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    // console.log({ newErrors });
    if (Object.keys(newErrors).length > 0) {
      validationErrorHandler(newErrors);
    }

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isCategoryCreating, setIsCategoryCreating] = useState(false);
  const createFunction = (data) => {
    createCategory(data)
      .unwrap()
      .then((res) => {
        console.log({ res });
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Category added successfully`}
            />
          ));

          setFormData({
            name: "",
            price: "",
            inStock: "",
            category: "",
            description: "",
            images: [],
          });
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandlerV2({ err });
      });
  };

  const updateFunction = (data) => {
    updateCategory(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Category updated successfully`}
            />
          ));
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandlerV2({ err });
      });
  };

  // SUBMIT DATA
  const handleSubmit = async () => {
    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction(formData);
      } else {
        createFunction(formData);
      }
    }
  };

  /* *************************************
  
  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

  if (createResult.isLoading || updateResult.isLoading) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
        {/* NAME */}
        <CustomField
          value={formData?.name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.name}
          id={"name"}
          label={"Name"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Name"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DESCRIPTION */}
        <CustomTextareaField
          value={formData?.description}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.description}
          id={"description"}
          label={"Description"}
          name={"description"}
          onChange={handleFormChange}
          placeholder={"Description"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={createResult.isLoading || updateResult.isLoading}
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          disabled={createResult.isLoading || updateResult.isLoading}
          onClick={handleSubmit}
          className="btn w-full md:btn-wide btn-primary"
        >
          {createResult.isLoading || updateResult.isLoading ? (
            <ButtonSpinner />
          ) : popupOption?.data ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </div>
  );
}
