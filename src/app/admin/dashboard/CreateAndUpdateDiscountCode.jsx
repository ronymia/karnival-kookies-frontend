"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ButtonSpinner from "@/Shared/ButtonSpinner";
import CustomField from "@/Shared/Fields/CustomField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import { errorHandler } from "@/Utils/errorHandler";
import { postCategory, updateCategory } from "@/apis/categories";
import { getAllIdAndNameOfProducts, uploadProductPic } from "@/apis/products";
import CustomMultiSelect from "@/Shared/Fields/CustomMultiSelect";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import { postDiscount, updateDiscount } from "@/apis/discounts";

const CreateAndUpdateDiscountCode = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : "",
    code: popupOption?.data ? popupOption?.data?.code : "",
    discountType: popupOption?.data ? popupOption?.data?.discountType : "",
    discountAmount: popupOption?.data ? popupOption?.data?.discountAmount : "",
    minimumSpend: popupOption?.data ? popupOption?.data?.minimumSpend : "",
  });

  console.log({ formData });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.code || formData.code.trim() === "") {
      newErrors.code = "Code is required";
    }
    if (!formData.discountType || formData.discountType.trim() === "") {
      newErrors.discountType = "Type is required";
    }
    if (formData.discountType === "percentage") {
      if (formData.discountAmount > 100) {
        newErrors.discountAmount = "Amount cannot be greater than 100%";
      }
    }
    if (!formData.discountAmount) {
      newErrors.discountAmount = "Amount is required";
    }
    if (!formData.minimumSpend) {
      newErrors.minimumSpend = "Minimum Spend is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
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
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const [isDiscountCreating, setIsDiscountCreating] = useState(false);
  const createFunction = (data) => {
    setIsDiscountCreating(true);
    postDiscount(data)
      .then((res) => {
        console.log({ res });
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Discount added successfully`}
            />
          ));

          setFormData({
            id: "",
            code: "",
            discountType: "",
            discountAmount: "",
            minimumSpend: "",
          });
          popupOption?.onClose();
          popupOption.setIsUpdating(Math.random());
          setIsDiscountCreating(false);
        }
      })
      .catch((err) => {
        console.log({ err });
        errorHandler({ err, setLoading: setIsDiscountCreating });
      });
  };

  const [isDiscountUpdating, setIsDiscountUpdating] = useState(false);
  const updateFunction = (data) => {
    setIsDiscountUpdating(true);
    updateDiscount(data)
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Discount updated successfully`}
            />
          ));
          popupOption?.onClose();
          popupOption.setIsUpdating(Math.random());
          setIsDiscountUpdating(false);
        }
      })
      .catch((err) => {
        errorHandler({ err, setLoading: setIsDiscountUpdating });
      });
  };

  if (isDiscountCreating || isDiscountUpdating) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
        {/* CODE */}
        <CustomField
          defaultValue={formData?.code}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.code}
          id={"code"}
          label={"Code"}
          name={"code"}
          onChange={handleFormChange}
          placeholder={"Code"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DISCOUNT TYPE */}
        <CustomMultiSelect
          disable={false}
          label={"Discount Type"}
          // loading={isCategoryLoading}
          placeholder="Select Discount Type"
          selectedValues={[
            {
              id: 1,
              name: "fixed",
            },
            {
              id: 2,
              name: "percentage",
            },
          ]?.filter((m) => m?.name === formData?.discountType)}
          setSelectedValues={(e) => {
            console.log({ e });
            setFormData({ ...formData, discountType: e[0]?.name });
          }}
          options={[
            {
              id: 1,
              name: "fixed",
            },
            {
              id: 2,
              name: "percentage",
            },
          ]}
          singleSelect
          error={errors?.discountType}
          required
        />

        {/* AMOUNT */}
        <CustomNumberField
          defaultValue={formData?.discountAmount}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.discountAmount}
          id={"discountAmount"}
          label={"Discount Amount"}
          name={"discountAmount"}
          onChange={handleFormChange}
          placeholder={"Discount Amount"}
          wrapperClassName={"w-full"}
          required={true}
        />
        <CustomNumberField
          defaultValue={formData?.minimumSpend}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.minimumSpend}
          id={"minimumSpend"}
          label={"Minimum Spend"}
          name={"minimumSpend"}
          onChange={handleFormChange}
          placeholder={"Minimum Spend"}
          wrapperClassName={"w-full"}
          required={true}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={isDiscountCreating || isDiscountUpdating}
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
        <button
          disabled={isDiscountCreating || isDiscountUpdating}
          onClick={handleSubmit}
          className="btn w-full md:btn-wide btn-primary"
        >
          {isDiscountCreating || isDiscountUpdating ? (
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
};

export default CreateAndUpdateDiscountCode;
