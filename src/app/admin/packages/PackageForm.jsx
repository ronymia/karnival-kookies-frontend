"use client";

import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomField from "@/Shared/Fields/CustomField";
import CustomFileUploader from "@/Shared/Fields/CustomFileUploader";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import React, { useEffect, useState } from "react";
import usePackageReducer from "./packageReducer";
import { usePopupContext } from "@/Context/ProjectProvider";
import {
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useUploadPackageImagesMutation,
} from "@/redux/apis/packageApis";
import { errorHandler } from "@/Utils/errorHandler";
import CustomToaster from "@/Shared/CustomToaster";
import toast from "react-hot-toast";
import CustomRadioButton from "@/components/UI/CustomRadioButton";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import { useGetCategoryByIdQuery } from "@/redux/apis/categoryApis";
import CustomLoading from "@/Shared/CustomLoading";

export default function PackageForm() {
  // FORM REDUCER
  const [errors, setErrors] = useState({});
  const { state, dispatch } = usePackageReducer();
  // POPUP FORM CONTEXT
  const { popupOption } = usePopupContext();
  // CREATE
  const [createPackage, createResult] = useCreatePackageMutation();
  // UPDATE
  const [updatePackage, updateResult] = useUpdatePackageMutation();
  // UPLOAD IMAGES
  const [uploadPackageImages, uploadResult] = useUploadPackageImagesMutation();

  // FORM INPUT HANDLER
  const handleFormChange = (e) => {
    // FIELD NAME AND VALUE
    const { name, value } = e.target;
    // SET TO STATE
    dispatch({ type: "UPDATE_FIELD", payload: { field: name, value } });
  };
  //   VALIDATE FORM
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!state.name || state.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE PRICE
    if (!state.regularPrice) {
      newErrors.regularPrice = "Regular Price is required";
    }
    if (state.regularPrice < 0) {
      newErrors.regularPrice = "Regular Price cannot be negative";
    }
    if (state.discountPrice < 0) {
      newErrors.discountPrice = "Discount Price cannot be negative";
    }
    // VALIDATE STOCK
    if (!state.inStock) {
      newErrors.inStock = "Stock is required";
    }
    if (state.inStock < 0) {
      newErrors.inStock = "Stock cannot be negative";
    }

    // VALIDATE IMAGES
    if (state?.images?.length === 0) {
      newErrors.image = "At least one image is required";
    }

    setErrors(newErrors);
    // console.log({ newErrors });
    // ValidationErrorHandler(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          errors={{
            validationErrors: Object.entries(newErrors).map((error, i) => {
              if (Array.isArray(error[1])) {
                return Object.entries(error[1][0])
                  ?.filter((error2, j) => error2[0] !== "id")
                  ?.map((error2, j) => error2[1])
                  ?.join(" & ");
              } else {
                return error[1];
              }
            }),
          }}
          text={`You are submitting invalid data`}
        />
      ));
    }

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // UPDATE FIELD
  useEffect(() => {
    if (popupOption?.data) {
      [
        "id",
        "name",
        "description",
        "regularPrice",
        "discountPrice",
        "is_active",
        "inStock",
        "images",
      ].forEach((field) => {
        dispatch({
          type: "UPDATE_FIELD",
          payload: { field, value: popupOption?.data[field] },
        });
      });
    }
  }, []);

  // HANDLE FILES FROM
  const handleFilesUpload = async (files) => {
    const validFiles = [];
    const fileArray = Array.from(files);

    // CHECK FILE SIZE
    fileArray.forEach((file) => {
      console.log({ clickedFile: file });
      if (file.size > 5 * 1024 * 1024) {
        // File size exceeds 5MB, show error message
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={`File "${file.name}" exceeds the limit of 5MB`}
          />
        ));
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      // UPLOAD IMAGES
      const resp = await uploadPackageImages(validFiles);

      // IF GOT UPLOAD ERROR
      if (uploadResult.isError) {
        const respErrors = errorHandlerV2({ err: uploadResult.error });
      }
      // IF IMAGE UPLOADED
      if (resp?.data?.success) {
        // ADD IMAGE INTO STATE
        dispatch({
          type: "ADD_IMAGE",
          payload: { field: "images", value: resp?.data?.data },
        });
      }
    }
  };

  // CREATE FUNCTION
  const createFunction = async (updatedState) => {
    await createPackage(updatedState)
      .then((resp) => {
        if (resp?.data?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Package added successfully`}
            />
          ));

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((error) => {
        const respErrors = errorHandler({ err: error });
        setErrors(respErrors);
      });
  };
  // UPDATE FUNCTION
  const updateFunction = async (updatedState) => {
    await updatePackage(updatedState)
      .then((resp) => {
        console.log({ resp });
        if (resp?.data?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Package updated successfully`}
            />
          ));

          // CLOSE POPUP
          popupOption?.onClose();
        }
      })
      .catch((error) => {
        const respErrors = errorHandler({ err: error });
        setErrors(respErrors);
      });
  };

  // FORM SUBMISSION
  const handleSubmit = async () => {
    if (validateForm()) {
      if (popupOption?.data) {
        await updateFunction(state);
      } else {
        // CREATE PACKAGE WITH IMAGES
        await createFunction(state);
      }
    }
  };

  console.log({ state });

  /* *********************************************************
  
  ***************************************************************/

  return (
    <div className={` pb-12 h-full flex flex-col justify-between gap-2`}>
      {/* NAME */}
      <CustomField
        value={state?.name}
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
      {/* REGULAR PRICE */}
      <CustomNumberField
        value={state?.regularPrice}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.regularPrice}
        id={"regularPrice"}
        label={"Regular Price"}
        name={"regularPrice"}
        onChange={handleFormChange}
        placeholder={"Regular Price"}
        wrapperClassName={"w-full"}
        required={true}
      />
      {/* DISCOUNT PRICE */}
      <CustomNumberField
        value={state?.discountPrice}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.discountPrice}
        id={"discountPrice"}
        label={"Discount Price"}
        name={"discountPrice"}
        onChange={handleFormChange}
        placeholder={"Discount Price"}
        wrapperClassName={"w-full"}
      />

      {/* STOCK */}
      <CustomNumberField
        value={state?.inStock}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.inStock}
        id={"inStock"}
        label={"Stock"}
        name={"inStock"}
        onChange={handleFormChange}
        placeholder={"Stock"}
        wrapperClassName={"w-full"}
        required={true}
      />
      <CustomRadioButton
        defaultChecked={state.is_active.toString()}
        label={`Package Activate`}
        required={true}
        onChange={(e) => {
          dispatch({
            type: "UPDATE_FIELD",
            payload: { field: e.target.name, value: Number(e.target.value) },
          });
        }}
        options={[
          { title: "Yes", name: "is_active", value: "1" },
          { title: "No", name: "is_active", value: "0" },
        ]}
        wrapperClassName={`w-full`}
        inputFieldClassName={"grid-cols-2"}
      />
      {/* DESCRIPTION */}
      <CustomTextareaField
        value={state?.description}
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

      {/* PACKAGE IMAGES */}
      <CustomFileUploader
        required
        label={`Upload Package Images`}
        details={`Allowed .png, .jpg, .jpeg, .pdf files under 5MB`}
        accept={".png, .jpg, .jpeg, .pdf"}
        files={state?.images}
        isFileUploading={uploadResult.isLoading}
        onFileSelect={async (e) => handleFilesUpload(e)}
        onDrop={async (files) => await handleFileUpload(files)}
        onRemove={(selectedImage) => {
          // REMOVE FROM FORM STATE
          dispatch({
            type: "REMOVE_IMAGE",
            payload: { field: "images", value: selectedImage },
          });
        }}
      />

      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={
            createResult.isLoading ||
            updateResult.isLoading ||
            uploadResult.isLoading
          }
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          disabled={
            createResult.isLoading ||
            updateResult.isLoading ||
            uploadResult.isLoading
          }
          onClick={handleSubmit}
          className="btn w-full md:btn-wide btn-primary"
        >
          {createResult.isLoading ||
          updateResult.isLoading ||
          uploadResult.isLoading ? (
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
