"use client";

import { useEffect } from "react";
import Button from "@/components/ui/buttons/Button";
import InputField from "@/components/ui/inputfields/InputField";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import ResetPasswordCode from "../components/ResetPasswordCode";
import NewPasswordForm from "../components/NewPasswordForm";

export default function ResetPasswordScreen() {
  const {
    currentTab,
    emailData,
    emailErrors,
    otpData,
    otpErrors,
    passwordData,
    passwordErrors,
    isEmailLoading,
    isOtpLoading,
    isPasswordLoading,
    handleEmailChange,
    handleEmailSubmit,
    handleOtpChange,
    handleOtpSubmit,
    handlePasswordChange,
    handlePasswordSubmit,
  } = useResetPasswordForm();

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Reset Password";
  }, []);

  return (
    <>
      {/* <=================== ENTER EMAIL TAB ===================> */}
      {currentTab === "reset_password" && (
        <form
          noValidate
          onSubmit={handleEmailSubmit}
          className="max-w-md mx-auto flex flex-col gap-10 p-5 pt-32 pb-60"
        >
          <h2 className="text-2xl font-bold capitalize text-center">
            Enter your email
          </h2>

          {/* EMAIL */}
          <InputField
            value={emailData?.email}
            disable={false}
            fieldClassName="w-full"
            error={emailErrors?.email}
            id="email"
            name="email"
            onChange={handleEmailChange}
            placeholder="Email"
            type="email"
            wrapperClassName="w-full"
            required
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            text="Submit"
            isLoading={isEmailLoading}
            buttonClass="mx-auto w-full md:w-1/2 flex items-center justify-center gap-2"
          />
        </form>
      )}

      {/* <=================== RESET PASSWORD CODE TAB ===================> */}
      {currentTab === "code" && (
        <ResetPasswordCode
          email={emailData.email}
          formData={otpData}
          errors={otpErrors}
          isLoading={isOtpLoading}
          onChange={handleOtpChange}
          onSubmit={handleOtpSubmit}
        />
      )}

      {/* <=================== SET NEW PASSWORD TAB ===================> */}
      {currentTab === "new_password" && (
        <NewPasswordForm
          formData={passwordData}
          errors={passwordErrors}
          isLoading={isPasswordLoading}
          onChange={handlePasswordChange}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </>
  );
}
