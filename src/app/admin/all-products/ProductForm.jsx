"use client";

import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
  useUploadProductsImagesMutation,
} from "@/redux/apis/productApis";
import { useEffect, useState } from "react";
import useProductReducer from "./productReducer";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useGetAllCategoriesQuery } from "@/redux/apis/categoryApis";
import toast from "react-hot-toast";
import QuillEditor from "@/components/UI/QuillEditor";
import InputField from "@/components/UI/inputFields/InputField";
import NumberField from "@/components/UI/inputFields/NumberField";
import RadioButton from "@/components/UI/inputFields/RadioButton";
import { BiSolidCheckCircle } from "react-icons/bi";
import Select from "@/components/UI/inputFields/Select";
import FileUploader from "@/components/UI/inputFields/FileUploader";
import { errorHandler } from "@/helpers/errorHandler";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";

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

  /* <================= VALIDATE FORM ===================> */
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!state.name || state.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    // VALIDATE PRICE
    if (!state?.price) {
      newErrors.price = "Price is required";
    } else if (state.price < 0) {
      newErrors.price = "Regular Price cannot be negative";
    }
    // VALIDATE DISCOUNT ENABLE
    if (state?.is_discount_enable !== 0 && state?.is_discount_enable !== 1) {
      newErrors.is_discount_enable = "Discount Enable is required";
    } else if (
      state?.is_discount_enable === 0 &&
      state?.is_discount_enable === 1
    ) {
      // VALIDATE DISCOUNT TYPE
      if (!state?.discount_type) {
        newErrors.discount_type = "Discount Type is required";
      }
      // VALIDATE DISCOUNT VALUE
      if (!state?.discount_value) {
        newErrors.discount_value = "Discount Value is required";
      } else if (state?.discount_value < 0) {
        newErrors.discount_value = "Discount Value cannot be negative";
      } else if (
        state?.discount_type === "fixed" &&
        state?.discount_value > state?.price
      ) {
        newErrors.discount_value =
          "Discount Value cannot be greater than price";
      } else if (
        state?.discount_type === "percent" &&
        state?.discount_value > 100
      ) {
        newErrors.discount_value = "Discount Value cannot be greater than 100%";
      }
    }

    // VALIDATE UNIT
    if (!state?.unit) {
      newErrors.unit = "Unit is required";
    }

    // VALIDATE QUANTITY
    if (!state.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (state.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative";
    }

    // VALIDATE CATEGORY
    if (!state?.category_id) {
      newErrors.category_id = "Category is required";
    }

    // VALIDATE IMAGES
    if (state?.images?.length === 0) {
      newErrors.images = "At least one image is required";
    }

    // SET ERRORS
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

  console.log({ state });
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
        const respErrors = errorHandler({ err: error });
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
        const respErrors = errorHandler({ err: error });
        setErrors(respErrors);
      });
  };

  // FORM SUBMISSION
  const handleOnSubmit = async (e) => {
    e.preventDefault();
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
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className={`p-3 h-full grid grid-cols-1 md:grid-cols-2 gap-3`}
    >
      <>
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
          wrapperClassName={"md:col-span-2"}
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
          wrapperClassName={"w-full md:col-span-2"}
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

        {/* CATEGORY */}
        <Select
          id={`category_id`}
          name={`category_id`}
          label={`Category`}
          placeholder={`Select Category`}
          required={true}
          disable={false}
          error={errors?.category_id}
          value={categories.data?.data
            ?.map((item) => ({
              id: item?.id,
              label: item?.name,
            }))
            .filter((item) => item?.id === state?.category_id)}
          options={categories.data?.data?.map((item) => ({
            id: item?.id,
            label: item?.name,
          }))}
          handleOnSelect={(e) => {
            dispatch({
              type: "UPDATE_FIELD",
              payload: { field: "category_id", value: e?.id || null },
            });
          }}
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
          wrapperClassName={"w-full md:col-span-2"}
        />

        {/* PRODUCT IMAGES */}
        <FileUploader
          multiple={true}
          accept={".png, .jpg, .jpeg"}
          id={`product_images`}
          label={"Upload Products Images"}
          required={true}
          error={errors?.images}
          wrapperClassName={`md:col-span-2`}
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
      </>

      {/* <==================== ACTION BUTTONS ====================> */}
      <div className="md:col-span-2 flex flex-col md:flex-row w-full justify-center md:justify-end items-center gap-2 pb-10">
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
          type="submit"
          disabled={
            createResult.isLoading ||
            updateResult.isLoading ||
            uploadResult.isLoading
          }
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
    </form>
  );
}
