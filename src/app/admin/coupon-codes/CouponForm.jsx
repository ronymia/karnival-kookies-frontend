"use client";
import FormActions from "@/components/layouts/forms/FormActions";
import InputField from "@/components/ui/inputfields/InputField";
import NumberField from "@/components/ui/inputfields/NumberField";
import RadioButton from "@/components/ui/inputfields/RadioButton";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { usePopupContext } from "@/hooks/usePopupContext";
import { errorHandler } from "@/helpers/errorHandler";
import {
  useCreateCouponCodeMutation,
  useUpdateCouponCodeMutation,
} from "@/redux/apis/couponCodeApi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CouponForm() {
  const { popupOption } = usePopupContext();
  //
  const [createCouponCode, createResult] = useCreateCouponCodeMutation();
  const [updateCouponCode, updateResult] = useUpdateCouponCodeMutation();
  // console.log({ popupOption });
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    code: popupOption?.data ? popupOption?.data?.code : "",
    discount_type: popupOption?.data ? popupOption?.data?.discount_type : "",
    discount_value: popupOption?.data ? popupOption?.data?.discount_value : "",
    minimum_spend: popupOption?.data ? popupOption?.data?.minimum_spend : "",
  });

  // console.log({ formData });
  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE CODE
    if (!formData.code || formData.code.trim() === "") {
      newErrors.code = "Code is required";
    }

    // VALIDATE DISCOUNT TYPE
    if (!formData.discount_type || formData.discount_type.trim() === "") {
      newErrors.discount_type = "Type is required";
    }
    if (formData.discount_type === "percent") {
      if (formData.discount_value > 100) {
        newErrors.discount_value = "Amount cannot be greater than 100%";
      }
    }

    // DISCOUNT VALUE
    if (!formData.discount_value) {
      newErrors.discount_value = "Amount is required";
    }

    // MINIMUM SPEND
    if (!formData.minimum_spend) {
      newErrors.minimum_spend = "Minimum Amount is required";
    }

    setErrors(newErrors);
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

  // CREATE FUNCTION
  const createFunction = async (data) => {
    await createCouponCode(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Coupon Code added successfully`}
            />
          ));

          setFormData({
            id: "",
            code: "",
            discount_type: "",
            discount_value: "",
            minimum_spend: "",
          });
          popupOption?.onClose?.();
        }
      })
      .catch((err) => {
        const obj = {};

        if (err?.status === 422) {
          err?.data?.errorSources?.forEach((item) => {
            obj[item?.path] = item?.message;
          });

          setErrors(obj);
        }
        errorHandler({ err });
      });
  };

  // UPDATE FUNCTION
  const updateFunction = async (data) => {
    await updateCouponCode(data)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"success"}
              text={`Discount updated successfully`}
            />
          ));
          popupOption?.onClose?.();
        }
      })
      .catch((err) => {
        const resErrors = errorHandler({ err });
        setErrors(resErrors);
      });
  };

  // SUBMIT DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction({
          ...formData,
          discount_value: parseFloat(formData?.discount_value),
          minimum_spend: formData?.minimum_spend
            ? parseFloat(formData?.minimum_spend)
            : 0,
        });
      } else {
        createFunction({
          ...formData,
          discount_value: parseFloat(formData?.discount_value),
          minimum_spend: formData?.minimum_spend
            ? parseFloat(formData?.minimum_spend)
            : 0,
        });
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`flex flex-col justify-center gap-3`}
    >
      <>
        {/* CODE */}
        <InputField
          value={formData?.code}
          disable={createResult.isLoading || updateResult.isLoading}
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

        {/* COUPON CODE TYPE */}
        <RadioButton
          defaultChecked={formData?.discount_type}
          error={errors?.discount_type}
          label="Discount Type"
          disabled={createResult.isLoading || updateResult.isLoading}
          required={true}
          onChange={handleFormChange}
          options={[
            {
              name: "discount_type",
              value: "fixed",
              title: "Fixed",
            },
            {
              name: "discount_type",
              value: "percent",
              title: "Percent",
            },
          ]}
          inputFieldClassName={"grid-cols-2 gap-2"}
        />

        {/* CODE CODE VALUE */}
        <NumberField
          value={formData?.discount_value}
          disable={createResult.isLoading || updateResult.isLoading}
          fieldClassName={"w-full"}
          error={errors?.discount_value}
          id={"discount_value"}
          label={"Discount Amount"}
          name={"discount_value"}
          onChange={handleFormChange}
          placeholder={"Discount Amount"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* MINIMUM SPEND AMOUNT */}
        <NumberField
          value={formData?.minimum_spend}
          disable={createResult.isLoading || updateResult.isLoading}
          fieldClassName={"w-full"}
          error={errors?.minimum_spend}
          id={"minimum_spend"}
          label={"Minimum Spend"}
          name={"minimum_spend"}
          onChange={handleFormChange}
          placeholder={"Minimum Spend"}
          wrapperClassName={"w-full"}
          required={true}
        />
      </>

      {/* BUTTONS */}
      <FormActions
        isLoading={createResult.isLoading || updateResult.isLoading}
        onCancel={popupOption?.onClose}
        submitText="Submit"
      />
    </form>
  );
}
