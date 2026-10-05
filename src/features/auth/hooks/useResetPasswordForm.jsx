"use client";

import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import {
  useGetAccessTokenMutation,
  useResetPasswordMutation,
  useSendVerificationCodeMutation,
} from "@/redux/apis/authApis";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function useResetPasswordForm() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("reset_password");
  const [email, setEmail] = useState("");

  const [sendVerificationCode, sendCodeResult] =
    useSendVerificationCodeMutation();
  const [resetPasswordMutation, resetPasswordResult] =
    useResetPasswordMutation();
  const [getAccessToken, accessTokenResult] = useGetAccessTokenMutation();

  const handleEmailSubmit = async (data) => {
    const userEmail = data?.email || email;
    setEmail(userEmail);

    try {
      const res = await sendVerificationCode({ email: userEmail }).unwrap();
      if (res?.success) {
        setCurrentTab("code");
      }
    } catch (err) {
      errorHandler({ err });
      throw err;
    }
  };

  const handlePasswordSubmit = async (data) => {
    const payload = {
      email,
      password: data.password,
    };

    try {
      const res = await resetPasswordMutation(payload).unwrap();

      if (res?.success) {
        try {
          const tokenRes = await getAccessToken({ email }).unwrap();
          if (tokenRes?.success) {
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type="success"
                text="Password reset successfully"
              />
            ));
            router.push("/");
          }
        } catch {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch (err) {
      errorHandler({ err });
      throw err;
    }
  };

  return {
    currentTab,
    setCurrentTab,
    email,
    setEmail,
    isEmailLoading: sendCodeResult.isLoading,
    isPasswordLoading:
      resetPasswordResult.isLoading || accessTokenResult.isLoading,
    handleEmailSubmit,
    handlePasswordSubmit,
  };
}
