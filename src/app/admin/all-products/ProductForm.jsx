"use client";

import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useUploadProductsImagesMutation,
} from "@/redux/apis/productApis";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomToaster from "@/Shared/CustomToaster";
import { useEffect, useState } from "react";
import useProductReducer from "./productReducer";
import { errorHandlerV2 } from "@/helpers/errorHandlerV2";
import CustomMultiSelect from "@/Shared/Fields/CustomMultiSelect";
import CustomFileUploader from "@/Shared/Fields/CustomFileUploader";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";
import toast from "react-hot-toast";
import QuillEditor from "@/components/UI/QuillEditor";
import InputField from "@/components/UI/inputFields/InputField";
import NumberField from "@/components/UI/inputFields/NumberField";

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

    // // VALIDATE NAME
    // if (!state.name || state.name.trim() === "") {
    //   newErrors.name = "Name is required";
    // }
    // // VALIDATE PRICE
    // if (!state.regular_price) {
    //   newErrors.regular_price = "Regular Price is required";
    // }
    // if (state.regular_price < 0) {
    //   newErrors.regular_price = "Regular Price cannot be negative";
    // }
    // if (state.discount_price < 0) {
    //   newErrors.discount_price = "Discount Price cannot be negative";
    // }
    // // VALIDATE STOCK
    // if (!state.quantity) {
    //   newErrors.quantity = "Stock is required";
    // }
    // if (state.quantity < 0) {
    //   newErrors.quantity = "Stock cannot be negative";
    // }

    // // VALIDATE IMAGES
    // if (state?.images?.length === 0) {
    //   newErrors.image = "At least one image is required";
    // }

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
    // return Object.keys(newErrors).length === 0;
    return true;
  };

  // UPDATE FIELD
  useEffect(() => {
    if (popupOption?.data) {
      dispatch({
        type: "SET_DATA",
        payload: {
          id: popupOption?.data?.id,
          name: popupOption?.data?.name,
          price: popupOption?.data?.price,
          quantity: popupOption?.data?.quantity,
          category_id: popupOption?.data?.category_id,
          description: popupOption?.data?.description,
          images: popupOption?.data?.images,
          is_discount_enable: popupOption?.data?.is_discount_enable,
          discount_value: popupOption?.data?.discount_value,
          discount_type: popupOption?.data?.discount_type,
          status: popupOption?.data?.status,
          unit: popupOption?.data?.unit,
        },
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
      .unwrap()
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
      .unwrap()
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

  console.log({ state });
  console.log({ data: popupOption?.data });
  /* *********************************************************
  
  ***************************************************************/

  return (
    <div className={` pb-12 h-full flex flex-col gap-3 justify-between`}>
      <div>
        {/* NAME */}
        <InputField
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
        <NumberField
          value={state?.price}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.price}
          id={"price"}
          label={"Price"}
          name={"price"}
          onChange={handleFormChange}
          placeholder={"Price"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DISCOUNT VALUE*/}
        <NumberField
          value={state?.discount_value}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.discount_value}
          id={"discount_value"}
          label={"Discount Amount"}
          name={"discount_value"}
          onChange={handleFormChange}
          placeholder={"Discount Amount"}
          wrapperClassName={"w-full"}
        />

        {/* QUANTITY */}
        <NumberField
          value={state?.quantity}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.quantity}
          id={"quantity"}
          label={"Quantity"}
          name={"quantity"}
          onChange={handleFormChange}
          placeholder={"Quantity"}
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
            (item) => item?.id === state?.category_id
          )}
          setSelectedValues={(e) => {
            // console.log({ e });
            dispatch({
              type: "UPDATE_FIELD",
              payload: { field: "category_id", value: e[0]?.id },
            });
          }}
          options={categories.data?.data}
          error={errors?.category_id}
        />

        {/* DESCRIPTION */}
        <QuillEditor
          value={state?.description}
          disable={false}
          quillClassName={"w-full"}
          error={errors?.description}
          id={"description"}
          label={"Description"}
          name={"description"}
          onChange={(content) => {
            dispatch({
              type: "UPDATE_FIELD",
              payload: { field: "description", value: content },
            });
          }}
          placeholder={"Description"}
          wrapperClassName={"w-full"}
        />
        <CustomFileUploader
          details={`Allowed .png, .jpg, .jpeg, .pdf files under 5MB`}
          accept={".png, .jpg, .jpeg, .pdf"}
          files={state?.images}
          label={"Upload Products Images"}
          required
          isFileUploading={uploadResult.isLoading}
          onFileSelect={async (e) => handleFilesUpload(e)}
          onDrop={(files) => handleFilesUpload(files)}
          onRemove={(selectedImage) => {
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
