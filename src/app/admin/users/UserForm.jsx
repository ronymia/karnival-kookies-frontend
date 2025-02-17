"use client";

import ButtonSpinner from "@/components/UI/buttons/ButtonSpinner";
import DatePicker from "@/components/UI/inputFields/DatePicker";
import InputField from "@/components/UI/inputFields/InputField";
import NumberField from "@/components/UI/inputFields/NumberField";
import PasswordField from "@/components/UI/inputFields/PasswordField";
import RadioButton from "@/components/UI/inputFields/RadioButton";
import Select from "@/components/UI/inputFields/Select";
import CustomToaster from "@/components/UI/toaster/CustomToaster";
import { usePopupContext } from "@/Context/ProjectProvider";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/redux/apis/userApis";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidCheckCircle } from "react-icons/bi";

// ROLES
const roles = [
  {
    id: "admin",
    value: "admin",
    label: "Admin",
  },
  {
    id: "manager",
    value: "manager",
    label: "Manager",
  },
  {
    id: "content_editor",
    value: "content_editor",
    label: "Content Editor",
  },
  {
    id: "product_manager",
    value: "product_manager",
    label: "Product Manager",
  },
  {
    id: "order_manager",
    value: "order_manager",
    label: "Order Manager",
  },
  {
    id: "customer_support",
    value: "customer_support",
    label: "Customer Support",
  },
  {
    id: "marketing_manager",
    value: "marketing_manager",
    label: "Marketing Manager",
  },
];

export default function UserForm() {
  const [createUser, createResult] = useCreateUserMutation();
  const [updateUser, updateResult] = useUpdateUserMutation();
  const { popupOption } = usePopupContext();
  // ERROR STATE
  const [errors, setErrors] = useState({});
  // FORM STATE
  const [formData, setFormData] = useState({
    id: popupOption?.data?.id ?? null,
    name: popupOption?.data?.profile?.name ?? "",
    email: popupOption?.data?.email ?? "",
    phone: popupOption?.data?.profile?.phone ?? "",
    address: popupOption?.data?.profile?.address ?? "",
    country: popupOption?.data?.profile?.country ?? "",
    city: popupOption?.data?.profile?.city ?? "",
    postcode: popupOption?.data?.profile?.postcode ?? "",
    date_of_birth: popupOption?.data?.profile?.date_of_birth ?? "",
    gender: popupOption?.data?.profile?.gender ?? "",
    password: popupOption?.data?.password ?? "",
    role: popupOption?.data?.role ?? "",
  });

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   FORM VALIDATE
  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    //   VALIDATE EMAIL
    if (!formData?.email || formData?.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData?.email?.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    //   VALIDATE ROLE
    if (!formData.role || formData.role.trim() === "") {
      newErrors.role = "Role is required";
    }

    //   VALIDATE DATE OF BIRTH
    if (!formData.date_of_birth || formData.date_of_birth.trim() === "") {
      newErrors.date_of_birth = "Date of birth is required";
    }

    //   VALIDATE GENDER
    if (!formData.gender || formData.gender.trim() === "") {
      newErrors.gender = "Gender is required";
    }

    //   VALIDATE PHONE
    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Phone is required";
    }

    //   VALIDATE ADDRESS
    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Address is required";
    }

    //   VALIDATE COUNTRY
    if (!formData.country || formData.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    //   VALIDATE CITY
    if (!formData.city || formData.city.trim() === "") {
      newErrors.city = "City is required";
    }

    //   VALIDATE POSTCODE
    if (!formData.postcode || formData.postcode.trim() === "") {
      newErrors.postcode = "Postcode is required";
    }

    //   VALIDATE PASSWORD
    if (!popupOption?.data?.id && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password) {
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(formData?.password)) {
        newErrors.password =
          "Password should have at least one uppercase, lowercase and number";
      }
      if (formData?.password?.length < 8) {
        newErrors.password = "Password should have at least 8 character";
      }
    }

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

  // UPDATE FUNCTION
  const updateFunction = async () => {
    await updateUser(formData)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          popupOption?.onClose();
        }
      })
      .catch((err) => {
        console.log({ first: err });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={"Something went wrong. Please register again"}
          />
        ));
      });
  };
  // CREATE FUNCTION
  const createFunction = async () => {
    await createUser(formData)
      .unwrap()
      .then((res) => {
        if (res?.success) {
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          popupOption?.onClose?.();
        }
      })
      .catch(() => {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"error"}
            text={"Something went wrong. Please register again"}
          />
        ));
      });
  };
  //   SUBMIT DATA
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (popupOption?.data) {
        updateFunction(formData);
      } else {
        createFunction(formData);
      }
    }
  };

  /* *****************************************
  
  *******************************************************/
  return (
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className={`p-4 grid grid-cols-1 md:grid-cols-2 gap-3 h-full`}
    >
      <>
        {/* NAME */}
        <InputField
          value={formData?.name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.name}
          id={"name"}
          name={"name"}
          label={"Name"}
          onChange={handleFormChange}
          placeholder={"Name"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* PHONE */}
        <NumberField
          value={formData?.phone}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.phone}
          id={"phone"}
          label={"Phone"}
          name={"phone"}
          onChange={handleFormChange}
          placeholder={"Phone"}
          wrapperClassName={"w-full"}
        />
        {/* EMAIL */}
        <InputField
          value={formData?.email}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.email}
          id={"email"}
          name={"email"}
          label={"Email"}
          onChange={handleFormChange}
          placeholder={"Email"}
          type={"email"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* ADDRESS */}
        <InputField
          value={formData?.address}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.address}
          id={"address"}
          name={"address"}
          label={"Address"}
          onChange={handleFormChange}
          placeholder={"Address"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* COUNTY */}
        <InputField
          value={formData?.country}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.country}
          id={"country"}
          name={"country"}
          label={"Country"}
          onChange={handleFormChange}
          placeholder={"Country"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* CITY */}
        <InputField
          value={formData?.city}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.city}
          id={"city"}
          name={"city"}
          label={"City"}
          onChange={handleFormChange}
          placeholder={"City"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* POSTCODE */}
        <InputField
          value={formData?.postcode}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.postcode}
          id={"postcode"}
          name={"postcode"}
          label={"Postcode"}
          onChange={handleFormChange}
          placeholder={"Postcode"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* DATE OF BIRTH */}
        <DatePicker
          right={true}
          id={"date_of_birth"}
          name={"date_of_birth"}
          label={"Date of birth"}
          placeholder={"Date of birth"}
          required={true}
          onChange={(date) => {
            setFormData({
              ...formData,
              date_of_birth: date,
            });
          }}
          defaultDate={formData?.date_of_birth}
          error={errors?.date_of_birth}
        />

        {/* GENDER */}
        <RadioButton
          options={[
            {
              name: "gender",
              title: "Male",
              value: "male",
              Icon: BiSolidCheckCircle,
            },
            {
              name: "gender",
              title: "Female",
              value: "female",
              Icon: BiSolidCheckCircle,
            },
          ]}
          onChange={handleFormChange}
          wrapperClassName={""}
          inputFieldClassName={"grid-cols-2 gap-5"}
          label={"Gender"}
          required={true}
          defaultChecked={formData?.gender}
          error={errors?.gender}
        />

        {/* ROLE */}
        <Select
          disable={false}
          label={"Role"}
          // loading={isCategoryLoading}
          placeholder={`Select Role`}
          options={roles}
          singleSelect
          error={errors?.category}
          value={roles?.filter((item) => item?.id === formData?.role)}
          handleOnSelect={(e) => {
            setFormData({ ...formData, role: e?.id });
          }}
        />
        {/* PASSWORD */}
        <PasswordField
          required={true}
          id="password"
          onChange={handleFormChange}
          value={formData?.password}
          label={"Password"}
          placeholder={`Password`}
          name={`password`}
          error={errors?.password}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
      </>

      {/* ACTION BUTTON */}
      <div
        className={`md:col-span-2 flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-auto py-5 gap-2`}
      >
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
