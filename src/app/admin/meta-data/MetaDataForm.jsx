"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import {
  useCreateMetaDataMutation,
  useUpdateMetaDataMutation,
} from "@/redux/apis/metaDataApis";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import FormActions from "@/components/layouts/forms/FormActions";
import InputField from "@/components/UI/inputFields/InputField";
import TextareaField from "@/components/UI/inputFields/TextareaField";
import Select from "@/components/UI/inputFields/Select";

const META_KEY = [
  {
    id: "login",
    value: "login",
    label: "Login Page",
  },
  {
    id: "register",
    value: "register",
    label: "Register Page",
  },
  {
    id: "home_page",
    value: "home_page",
    label: "Home Page",
  },
  {
    id: "product_page",
    value: "product_page",
    label: "Product Page",
  },
  {
    id: "single_product",
    value: "single_product",
    label: "Single Product",
  },
];

export default function MetaDataForm() {
  const { popupOption } = usePopupContext();

  const [createMetaData, createResult] = useCreateMetaDataMutation();
  const [updateMetaData, updateResult] = useUpdateMetaDataMutation();

  //
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    meta_key: popupOption?.data ? popupOption?.data?.meta_key : "",
    title: popupOption?.data ? popupOption?.data?.title : "",
    description: popupOption?.data ? popupOption?.data?.description : "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE META KEY
    if (!formData.meta_key || formData.meta_key.trim() === "") {
      newErrors.meta_key = "Meta Key is required";
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
    return <CustomLoading height="h-[40vh]" />;
  }
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`h-full flex flex-col justify-between`}
    >
      <div>
        {/* META KEY */}
        <Select
          id={`meta_key`}
          name={`meta_key`}
          label={`Meta Key`}
          placeholder={`Select Meta Key`}
          required={true}
          disable={false}
          error={errors?.["meta_key"]}
          value={META_KEY.filter((item) => item?.id === formData?.meta_key)}
          options={META_KEY}
          handleOnSelect={(e) => {
            setFormData((prev) => ({
              ...prev,
              meta_key: e?.id,
            }));
          }}
        />

        {/* TITLE */}
        <InputField
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
        <TextareaField
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

      {/* FORM ACTIONS */}
      <FormActions
        isLoading={createResult.isLoading || updateResult.isLoading}
        onCancel={popupOption?.onClose}
        onSubmit={handleSubmit}
        submitText="Submit"
        className={`mt-auto`}
      />
    </form>
  );
}
