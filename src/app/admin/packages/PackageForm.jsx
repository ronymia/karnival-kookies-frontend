"use client";

import { useEffect, useState } from "react";
import usePackageReducer from "./packageReducer";
import {
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useUploadPackageImagesMutation,
} from "@/redux/apis/packageApis";
import toast from "react-hot-toast";
import RadioButton from "@/components/ui/inputfields/RadioButton";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import InputField from "@/components/ui/inputfields/InputField";
import NumberField from "@/components/ui/inputfields/NumberField";
import FileUploader from "@/components/ui/inputfields/FileUploader";
import QuillEditor from "@/components/ui/QuillEditor";
import { BiSolidCheckCircle } from "react-icons/bi";

export default function PackageForm({ data, handleClosePopup }) {
  // FORM REDUCER
  const [errors, setErrors] = useState({});
  const { state, dispatch } = usePackageReducer();
  // POPUP FORM CONTEXT
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
    // if (!state.inStock) {
    //   newErrors.inStock = "Stock is required";
    // }
    // if (state.inStock < 0) {
    //   newErrors.inStock = "Stock cannot be negative";
    // }

    // // VALIDATE IMAGES
    // if (state?.images?.length === 0) {
    //   newErrors.image = "At least one image is required";
    // }

    setErrors(newErrors);
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
    if (data) {
      [
        "id",
        "name",
        "description",
        "price",
        "is_discount_enable",
        "discount_type",
        "discount_value",
        "status",
        "unit",
        "quantity",
        "images",
      ].forEach((field) => {
        dispatch({
          type: "UPDATE_FIELD",
          payload: { field, value: data[field] },
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
        errorHandler({ err: uploadResult.error });
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
      .unwrap()
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
          handleClosePopup?.();
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
      .unwrap()
      .then((resp) => {
        if (resp?.data?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Package updated successfully`}
            />
          ));

          // CLOSE POPUP
          handleClosePopup?.();
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
      if (data) {
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
    <div className={` p-3 grid grid-cols-1 gap-3`}>
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
        wrapperClassName={""}
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

      {/* ENABLE DISCOUNT */}
      <RadioButton
        options={[
          {
            name: "is_discount_enable",
            title: "Enable",
            value: 1,
            Icon: BiSolidCheckCircle,
          },
          {
            name: "is_discount_enable",
            title: "Disable",
            value: 0,
            Icon: BiSolidCheckCircle,
          },
        ]}
        onChange={(e) => {
          const { name, value } = e.target;
          dispatch({
            type: "UPDATE_FIELD",
            payload: { field: name, value: Number(value) },
          });
        }}
        wrapperClassName={"w-full"}
        inputFieldClassName={"grid-cols-2 gap-5"}
        label={"Discount Enable"}
        required={true}
        defaultChecked={state?.is_discount_enable}
        error={errors?.is_discount_enable}
      />

      {state?.is_discount_enable ? (
        <>
          {/* DISCOUNT TYPE */}
          <RadioButton
            options={[
              {
                name: "discount_type",
                title: "Fixed",
                value: "fixed",
                Icon: BiSolidCheckCircle,
              },
              {
                name: "discount_type",
                title: "Percentage",
                value: "percent",
                Icon: BiSolidCheckCircle,
              },
            ]}
            onChange={handleFormChange}
            wrapperClassName={"w-full"}
            inputFieldClassName={"grid-cols-2 gap-5"}
            label={"Discount Type"}
            required={true}
            defaultChecked={state?.discount_type}
            error={errors?.discount_type}
          />
          {/* DISCOUNT VALUE */}
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
        </>
      ) : null}

      {/* UNIT */}
      <RadioButton
        options={[
          {
            name: "unit",
            title: "kg",
            value: "kg",
            Icon: BiSolidCheckCircle,
          },
          {
            name: "unit",
            title: "litre",
            value: "litre",
            Icon: BiSolidCheckCircle,
          },
          {
            name: "unit",
            title: "pcs",
            value: "pcs",
            Icon: BiSolidCheckCircle,
          },
          {
            name: "unit",
            title: "bag",
            value: "bag",
            Icon: BiSolidCheckCircle,
          },
        ]}
        onChange={handleFormChange}
        wrapperClassName={""}
        inputFieldClassName={"grid-cols-4 gap-5"}
        label={"Product Unit"}
        required={true}
        defaultChecked={state?.unit}
        error={errors?.unit}
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
        wrapperClassName={""}
      />

      {/* PRODUCT IMAGES */}
      <FileUploader
        multiple={true}
        accept={".png, .jpg, .jpeg"}
        id={`product_images`}
        label={"Upload Products Images"}
        required={true}
        error={errors?.images}
        wrapperClassName={``}
        files={state?.images}
        isFileUploading={uploadResult.isLoading}
        onFileSelect={handleFilesUpload}
        onDrop={handleFilesUpload}
        onRemove={(selectedImage) => {
          dispatch({
            type: "REMOVE_IMAGE",
            payload: { field: "images", value: selectedImage },
          });
        }}
      />
      <div className=" flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={
            createResult.isLoading ||
            updateResult.isLoading ||
            uploadResult.isLoading
          }
          onClick={handleClosePopup}
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
          ) : data ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </div>
  );
}
