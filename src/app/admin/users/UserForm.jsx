"use client";

import { usePopupContext } from "@/Context/ProjectProvider";
import { useCreateUserMutation } from "@/redux/apis/authApis";
import Button from "@/Shared/Button";
import CustomToaster from "@/Shared/CustomToaster";
import CustomField from "@/Shared/Fields/CustomField";
import CustomMultiSelect from "@/Shared/Fields/CustomMultiSelect";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import CustomPasswordField from "@/Shared/Fields/CustomPasswordField";
import React, { useState } from "react";
import toast from "react-hot-toast";

// ROLES
const roles = [
  {
    id: "admin",
    name: "Admin",
  },
  {
    id: "manager",
    name: "Manager",
  },
  {
    id: "content_editor",
    name: "Content Editor",
  },
  {
    id: "product_manager",
    name: "Product Manager",
  },
  {
    id: "order_manager",
    name: "Order Manager",
  },
  {
    id: "customer_support",
    name: "Customer Support",
  },
  {
    id: "marketing_manager",
    name: "Marketing Manager",
  },
];

export default function UserForm() {
  const [createUser, createResult] = useCreateUserMutation();
  const { popupOption } = usePopupContext();
  // ERROR STATE
  const [errors, setErrors] = useState({});
  // FORM STATE
  const [formData, setFormData] = useState({
    id: popupOption?.data?.id ?? null,
    name: popupOption?.data?.name ?? "",
    phone: popupOption?.data?.phone ?? "",
    email: popupOption?.data?.email ?? "",
    password: popupOption?.data?.password ?? "",
    role: popupOption?.data?.role ?? "admin",
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

    //   VALIDATE PASSWORD
    if (!formData.password) {
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
    createUser(formData)
      .unwrap()
      .then((res) => {
        console.log({ user: res });
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
    createUser(formData)
      .unwrap()
      .then((res) => {
        console.log({ user: res });
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
  //   SUBMIT DATA
  const handleSubmit = async () => {
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
    <div>
      <div>
        {/* NAME */}
        <CustomField
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
        <CustomNumberField
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
        <CustomField
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

        {/* ROLE */}
        <CustomMultiSelect
          disable={false}
          label={"Role"}
          // loading={isCategoryLoading}
          placeholder="Select Role"
          selectedValues={roles?.filter((m) => m?.id === formData?.role)}
          setSelectedValues={(e) => {
            // console.log({ e });
            setFormData({ ...formData, role: e[0]?.id });
          }}
          options={roles}
          singleSelect
          error={errors?.category}
        />
        {/* PASSWORD */}
        <CustomPasswordField
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
      </div>
      <div className={`flex justify-center items-center`}>
        <Button
          text={"Create User"}
          handler={handleSubmit}
          isLoading={createResult.isLoading}
        />
      </div>
    </div>
  );
}
