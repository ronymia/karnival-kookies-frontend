"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomField from "@/Shared/Fields/CustomField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import {
  useCreateMetaDataMutation,
  useUpdateMetaDataMutation,
} from "@/redux/apis/metaDataApis";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";

export default function MetaDataForm() {
  const { popupOption } = usePopupContext();

  const [createMetaData, createResult] = useCreateMetaDataMutation();
  const [updateMetaData, updateResult] = useUpdateMetaDataMutation();

  //
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    url: popupOption?.data ? popupOption?.data?.url : "",
    title: popupOption?.data ? popupOption?.data?.title : "",
    description: popupOption?.data ? popupOption?.data?.description : "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE URL
    if (!formData.url || formData.url.trim() === "") {
      newErrors.url = "URL is required";
    }
    // VALIDATE TITLE
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }
    // VALIDATE DESCRIPTION
    if (!formData.description) {
      newErrors.description = "Description is required";
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

  const createFunction = (data) => {
    createMetaData(data)
      .unwrap()
      .then((res) => {
        console.log({ res });
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Meta Data added successfully`}
            />
          ));

          setFormData({
            title: "",
            description: "",
          });
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  const updateFunction = (data) => {
    updateMetaData(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Meta Data updated successfully`}
            />
          ));
          setFormData({
            title: "",
            description: "",
          });
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
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
        {/* URL */}
        <CustomField
          value={formData?.url}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.url}
          id={"url"}
          label={"URL"}
          name={"url"}
          onChange={handleFormChange}
          placeholder={"URL"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* TITLE */}
        <CustomField
          value={formData?.title}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.title}
          id={"title"}
          label={"Title"}
          name={"title"}
          onChange={handleFormChange}
          placeholder={"Title"}
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
