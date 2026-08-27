"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import {
  useGetAccessTokenMutation,
  useVerifyEmailCodeMutation,
} from "@/redux/apis/authApis";
import { authService } from "../services/authService";

export function useVerificationCode({ email }) {
  const router = useRouter();
  const [verifyEmailCode, verifyResult] = useVerifyEmailCodeMutation();
  const [getAccessToken, tokenResult] = useGetAccessTokenMutation();

  const [formData, setFormData] = useState({
    digit_1: "",
    digit_2: "",
    digit_3: "",
    digit_4: "",
  });

  const [errors, setErrors] = useState({});

  const handleFormChange = (e, nextId, previousId) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const nextInput = document.querySelector(`#${nextId}`);
    const previousInput = document.querySelector(`#${previousId}`);

    if (value === "") {
      previousInput?.focus();
    } else {
      nextInput?.focus();
    }

    if (formData.digit_1 && formData.digit_2 && formData.digit_3 && formData.digit_4) {
      setErrors({});
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const validation = authService.validateOtp(formData);
    setErrors(validation.errors);

    if (!validation.valid) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          errors={{ validationErrors: Object.values(validation.errors) }}
          text="You are submitting invalid data"
        />
      ));
      return;
    }

    const otp = `${formData.digit_1}${formData.digit_2}${formData.digit_3}${formData.digit_4}`;

    try {
      const res = await verifyEmailCode({
        otp,
        email,
      }).unwrap();

      if (res?.success) {
        setFormData({
          digit_1: "",
          digit_2: "",
          digit_3: "",
          digit_4: "",
        });

        try {
          const tokenRes = await getAccessToken({ email }).unwrap();
          if (tokenRes?.success) {
            router.push("/");
          }
        } catch {
          router.push("/login");
        }
      } else {
        setErrors({
          verifyError: res?.message || "Invalid verification code",
        });
      }
    } catch (err) {
      setErrors({
        verifyError: err?.data?.message || "Verification failed",
      });
    }
  };

  return {
    formData,
    errors,
    isLoading: verifyResult.isLoading || tokenResult.isLoading,
    handleFormChange,
    handleOnSubmit,
  };
}
