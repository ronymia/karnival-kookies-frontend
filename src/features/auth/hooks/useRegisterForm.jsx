"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useRegisterUserMutation } from "@/redux/apis/authApis";
import { authService } from "../services/authService";

export function useRegisterForm() {
  const [currentTab, setCurrentTab] = useState("register");
  const [userRegister, registerResult] = useRegisterUserMutation();
  const [errors, setErrors] = useState({});
  const [codeError, setCodeError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    postcode: "",
    date_of_birth: "",
    gender: "",
    password: "",
    role: "customer",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date_of_birth: date,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const validation = authService.validateRegisterForm(formData);
    setErrors(validation.errors);

    if (!validation.valid) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          errors={{
            validationErrors: Object.values(validation.errors),
          }}
          text="You are submitting invalid data"
        />
      ));
      return;
    }

    try {
      const res = await userRegister(formData).unwrap();
      if (res?.error) {
        toast.custom((t) => (
          <CustomToaster t={t} type="error" text={res?.error} />
        ));
        return;
      }
      setCodeError(res?.error || "");

      if (res?.success) {
        setCurrentTab("code");
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          country: "",
          city: "",
          postcode: "",
          date_of_birth: "",
          gender: "",
          role: "customer",
        });
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="error"
            text="Something went wrong. Please register again"
          />
        ));
      }
    } catch (err) {
      const parsedErrors = errorHandler({ err });
      setErrors(parsedErrors || {});
    }
  };

  return {
    currentTab,
    setCurrentTab,
    formData,
    errors,
    codeError,
    isLoading: registerResult.isLoading,
    handleFormChange,
    handleDateChange,
    handleOnSubmit,
  };
}
