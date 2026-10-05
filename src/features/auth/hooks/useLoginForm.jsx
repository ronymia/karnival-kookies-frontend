"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/helpers/errorHandler";
import { useLoginUserMutation } from "@/redux/apis/authApis";

export function useLoginForm() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("login");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [login, loginResult] = useLoginUserMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();

      if (!res?.data?.user?.is_email_verified) {
        setUnverifiedEmail(data?.email || "");
        setCurrentTab("code");
        return;
      }

      if (res?.success) {
        router.replace("/");
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
    isLoading: loginResult.isLoading,
    handleOnSubmit,
  };
}
