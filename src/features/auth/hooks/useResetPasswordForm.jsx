"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import {
  useGetAccessTokenMutation,
  useResetPasswordMutation,
  useSendVerificationCodeMutation,
  useVerifyEmailCodeMutation,
} from "@/redux/apis/authApis";
import { authService } from "../services/authService";

export function useResetPasswordForm() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("reset_password");
  const [resetUserPassword, sendCodeResult] = useSendVerificationCodeMutation();
  const [verifyEmailCode, verifyCodeResult] = useVerifyEmailCodeMutation();
  const [resetPasswordMutation, resetPasswordResult] = useResetPasswordMutation();
  const [getAccessToken, accessTokenResult] = useGetAccessTokenMutation();

  // EMAIL FORM STATE
  const [emailData, setEmailData] = useState({ email: "" });
  const [emailErrors, setEmailErrors] = useState({});

  // OTP FORM STATE
  const [otpData, setOtpData] = useState({
    digit_1: "",
    digit_2: "",
    digit_3: "",
    digit_4: "",
  });
  const [otpErrors, setOtpErrors] = useState({});

  // NEW PASSWORD STATE
  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // EMAIL CHANGE
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT EMAIL
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const validation = authService.validateResetPasswordEmail(emailData);
    setEmailErrors(validation.errors);

    if (!validation.valid) return;

    try {
      const res = await resetUserPassword({ email: emailData.email }).unwrap();
      if (res?.success) {
        setCurrentTab("code");
      }
    } catch (err) {
      setEmailErrors({
        email: err?.data?.message || "Failed to send verification code",
      });
    }
  };

  // OTP CHANGE
  const handleOtpChange = (e, nextId, previousId) => {
    const { name, value } = e.target;
    setOtpData((prev) => ({ ...prev, [name]: value }));

    const nextInput = document.querySelector(`#${nextId}`);
    const previousInput = document.querySelector(`#${previousId}`);

    if (value === "") {
      previousInput?.focus();
    } else {
      nextInput?.focus();
    }

    if (otpData.digit_1 && otpData.digit_2 && otpData.digit_3 && otpData.digit_4) {
      setOtpErrors({});
    }
  };

  // SUBMIT OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const validation = authService.validateOtp(otpData);
    setOtpErrors(validation.errors);

    if (!validation.valid) return;

    const otp = `${otpData.digit_1}${otpData.digit_2}${otpData.digit_3}${otpData.digit_4}`;

    try {
      const res = await verifyEmailCode({
        otp,
        email: emailData.email,
      }).unwrap();

      if (res?.success) {
        setOtpData({
          digit_1: "",
          digit_2: "",
          digit_3: "",
          digit_4: "",
        });
        setCurrentTab("new_password");
      } else {
        setOtpErrors({
          verifyError: res?.message || "Invalid verification code",
        });
      }
    } catch (err) {
      setOtpErrors({
        verifyError: err?.data?.message || "Verification failed",
      });
    }
  };

  // PASSWORD CHANGE
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // SUBMIT NEW PASSWORD
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: emailData.email,
      password: passwordData.password,
      password_confirmation: passwordData.password_confirmation,
    };
    const validation = authService.validateNewPasswordForm(payload);
    setPasswordErrors(validation.errors);

    if (!validation.valid) return;

    try {
      const res = await resetPasswordMutation({
        email: payload.email,
        password: payload.password,
      }).unwrap();

      if (res?.success) {
        try {
          const tokenRes = await getAccessToken({ email: payload.email }).unwrap();
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
      setPasswordErrors({
        password: err?.data?.message || "Failed to reset password",
      });
    }
  };

  return {
    currentTab,
    setCurrentTab,
    emailData,
    emailErrors,
    otpData,
    otpErrors,
    passwordData,
    passwordErrors,
    isEmailLoading: sendCodeResult.isLoading,
    isOtpLoading: verifyCodeResult.isLoading,
    isPasswordLoading: resetPasswordResult.isLoading || accessTokenResult.isLoading,
    handleEmailChange,
    handleEmailSubmit,
    handleOtpChange,
    handleOtpSubmit,
    handlePasswordChange,
    handlePasswordSubmit,
  };
}
