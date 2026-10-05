"use client";

import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useRegisterUserMutation } from "@/redux/apis/authApis";
import { useState } from "react";
import toast from "react-hot-toast";

export function useRegisterForm() {
  const [currentTab, setCurrentTab] = useState("register");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [userRegister, registerResult] = useRegisterUserMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await userRegister(data).unwrap();
      if (res?.error) {
        toast.custom((t) => (
          <CustomToaster t={t} type="error" text={res?.error} />
        ));
        return;
      }

      if (res?.success) {
        setUnverifiedEmail(data?.email || "");
        setCurrentTab("code");
      } else {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="error"
            text="Something went wrong. Please register again"
          />
        ));
      }
    } catch (err) {
      errorHandler({ err });
      throw err;
    }
  };

  return {
    currentTab,
    setCurrentTab,
    unverifiedEmail,
    isLoading: registerResult.isLoading,
    handleOnSubmit,
  };
}
