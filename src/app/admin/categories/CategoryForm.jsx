"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/apis/categoryApis";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { errorHandler } from "@/helpers/errorHandler";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import InputField from "@/components/UI/inputFields/InputField";
import TextareaField from "@/components/UI/inputFields/TextareaField";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";
import CustomToaster from "@/components/UI/toaster/CustomToaster";

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

  const createFunction = async (data) => {
    createCategory(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // SHOW SUCCESS MESSAGE
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Category added successfully`}
            />
          ));

          // CLEAR FORM DATA
          setFormData({
            name: "",
            description: "",
          });

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  const updateFunction = async (data) => {
    await updateCategory(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          //  SHOW SUCCESS MESSAGE
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Category updated successfully`}
            />
          ));

          // CLEAR FORM DATA
          setFormData({
            name: "",
            description: "",
          });

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        errorHandler({ err });
      });
  };

  // SUBMIT DATA
  const handleOnSubmit = async () => {
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
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className={` pb-12 h-full flex flex-col justify-between`}
    >
      <div>
        {/* NAME */}
        <InputField
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

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={createResult.isLoading || updateResult.isLoading}
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createResult.isLoading || updateResult.isLoading}
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
    </form>
  );
}
