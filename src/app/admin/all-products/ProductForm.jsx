"use client";

import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useUploadProductsImagesMutation,
} from "@/redux/apis/productApis";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomToaster from "@/Shared/CustomToaster";
import React, { useEffect, useState } from "react";
import useProductReducer from "./productReducer";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import CustomField from "@/Shared/Fields/CustomField";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import CustomMultiSelect from "@/Shared/Fields/CustomMultiSelect";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import CustomFileUploader from "@/Shared/Fields/CustomFileUploader";
import { usePopupContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";
import toast from "react-hot-toast";

export default function ProductForm() {
  // FORM REDUCER
  const [errors, setErrors] = useState({});
  const { state, dispatch } = useProductReducer();
  // POPUP FORM CONTEXT
  const { popupOption } = usePopupContext();
  // CREATE
  const [createProduct, createResult] = useCreateProductsMutation();
  // UPDATE
  const [updateProduct, updateResult] = useUpdateProductsMutation();
  // UPLOAD IMAGES
  const [uploadProductFiles, uploadResult] = useUploadProductsImagesMutation();
  const categories = useGetAllCategoriesQuery({});

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
        "category",
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
      const resp = await uploadProductFiles(validFiles);

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
    await createProduct(updatedState)
      .then(() => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Product added successfully`}
          />
        ));

        // CLOSE POPUP
        popupOption?.onClose();
      })
      .catch((error) => {
        const respErrors = errorHandlerV2({ err: error });
        setErrors(respErrors);
      });
  };
  // UPDATE FUNCTION
  const updateFunction = async (updatedState) => {
    await updateProduct(updatedState)
      .then((resp) => {
        console.log({ resp });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`Product updated successfully`}
          />
        ));

        // CLOSE POPUP
        popupOption?.onClose();
      })
      .catch((error) => {
        const respErrors = errorHandlerV2({ err: error });
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

  /* *********************************************************
  
  ***************************************************************/

  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
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
        {/* PRICE */}
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

        {/* CATEGORY */}
        <CustomMultiSelect
          singleSelect
          disable={false}
          label={"Category"}
          loading={categories.isLoading}
          placeholder="Select Category"
          selectedValues={categories.data?.data?.filter(
            (item) => item?.id === state?.category
          )}
          setSelectedValues={(e) => {
            // console.log({ e });
            dispatch({
              type: "UPDATE_FIELD",
              payload: { field: "category", value: e[0]?.id },
            });
          }}
          options={categories.data?.data}
          error={errors?.category}
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
        <CustomFileUploader
          details={`Allowed .png, .jpg, .jpeg, .pdf files under 5MB`}
          accept={".png, .jpg, .jpeg, .pdf"}
          files={state?.images}
          fileFolder={"Products"}
          required
          isFileUploading={uploadResult.isLoading}
          onFileSelect={async (e) => handleFilesUpload(e)}
          onDrop={(files) => handleFilesUpload(files)}
          onRemove={(e) => {
            // REMOVE FROM FORM STATE
            dispatch({
              type: "REMOVE_IMAGE",
              payload: { field: "images", value: selectedImage },
            });
          }}
        />
      </div>
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
