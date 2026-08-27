"use client";

import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useLoginUserMutation } from "@/redux/apis/authApis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/authService";

export function useLoginForm() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("login");
  const [errors, setErrors] = useState({});
  const [login, loginResult] = useLoginUserMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const validation = authService.validateLoginForm(formData);
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
      const res = await login(formData).unwrap();

      if (!res?.data?.user?.is_email_verified) {
        setCurrentTab("code");
        return;
      }

      if (res?.success) {
        setFormData({
          email: "",
          password: "",
        });
        router.replace("/");
      }
    } catch (err) {
      if (err?.status === 401) {
        const obj = {};
        err?.data?.errorSources?.forEach((item) => {
          obj["password"] = item?.message;
        });
        setErrors(obj);
      }
      errorHandler({ err });
    }
  };

  return {
    currentTab,
    setCurrentTab,
    formData,
    errors,
    isLoading: loginResult.isLoading,
    handleFormChange,
    handleOnSubmit,
  };
}
