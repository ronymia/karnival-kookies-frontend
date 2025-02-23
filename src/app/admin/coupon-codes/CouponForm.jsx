"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomField from "@/Shared/Fields/CustomField";
import CustomMultiSelect from "@/Shared/Fields/CustomMultiSelect";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import { postDiscount, updateDiscount } from "@/apis/discounts";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import CustomLoading from "@/components/UI/loader/CustomLoading";
import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";
import { errorHandler } from "@/helpers/errorHandler";

export default function CouponForm() {
  const { popupOption } = usePopupContext();
  // console.log({ popupOption });
  const [formData, setFormData] = useState({
    id: popupOption?.data ? popupOption?.data?.id : null,
    code: popupOption?.data ? popupOption?.data?.code : "",
    discount_type: popupOption?.data ? popupOption?.data?.discount_type : "",
    discount_value: popupOption?.data
      ? popupOption?.data?.discount_value
      : null,
    minimum_spend: popupOption?.data ? popupOption?.data?.minimum_spend : null,
  });

  // console.log({ formData });
  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    // if (!formData.code || formData.code.trim() === "") {
    //   newErrors.code = "Code is required";
    // }
    if (!formData.discount_type || formData.discount_type.trim() === "") {
      newErrors.discount_type = "Type is required";
    }
    if (formData.discount_type === "percentage") {
      if (formData.discount_value > 100) {
        newErrors.discount_value = "Amount cannot be greater than 100%";
      }
    }
    if (!formData.discount_value) {
      newErrors.discount_value = "Amount is required";
    }
    if (!formData.minimum_spend) {
      newErrors.minimum_spend = "Minimum Spend is required";
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
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            discount_type: "",
            discount_value: "",
            minimum_spend: "",
          });
          popupOption?.onClose();
          popupOption.setIsUpdating(Math.random());
          setIsDiscountCreating(false);
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
        const obj = {};

        // if (err?.status === 422) {
        //   err?.data?.errorSources?.forEach((item) => {
        //     obj[item?.path] = item?.message;
        //   });
        //   setErrors(obj);
        // }
        const resErrors = errorHandler({
          err,
          setLoading: setIsDiscountUpdating,
        });
        setErrors(resErrors);
      });
  };

  // SUBMIT DATA
  const handleSubmit = async () => {
    // Validate form
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction({
          ...formData,
          discount_value: parseFloat(formData?.discount_value),
          minimum_spend: parseFloat(formData?.minimum_spend),
        });
      } else {
        createFunction({
          ...formData,
          discount_value: parseFloat(formData?.discount_value),
          minimum_spend: parseFloat(formData?.minimum_spend),
        });
      }
    }
  };

  if (isDiscountCreating || isDiscountUpdating) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div>
        {/* CODE */}
        <CustomField
          value={formData?.code}
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
          ]?.filter((m) => m?.name === formData?.discount_type)}
          setSelectedValues={(e) => {
            console.log({ e });
            setFormData({ ...formData, discount_type: e[0]?.name });
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
          error={errors?.discount_type}
          required
        />

        {/* AMOUNT */}
        <CustomNumberField
          value={formData?.discount_value}
          disable={false}
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
        <CustomNumberField
          value={formData?.minimum_spend}
          disable={false}
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
}
