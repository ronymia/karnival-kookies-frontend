"use client";

import { CustomForm, InputField } from "@/components/form";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import Link from "next/link";
import { useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiKey, FiMail } from "react-icons/fi";
import NewPasswordForm from "../components/NewPasswordForm";
import VerificationCode from "../components/VerificationCode";
import { useResetPasswordForm } from "../hooks/useResetPasswordForm";
import { resetPasswordEmailSchema } from "../schema";

export default function ResetPasswordScreen() {
  const {
    currentTab,
    setCurrentTab,
    email,
    isEmailLoading,
    isPasswordLoading,
    handleEmailSubmit,
    handlePasswordSubmit,
  } = useResetPasswordForm();

  // Set Page Title
  useEffect(() => {
    document.title = "Karnival Cookies | Reset Password";
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 sm:px-6 overflow-hidden">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-12 right-12 w-72 h-72 bg-[#e6aa38]/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-12 left-12 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* <=================== ENTER EMAIL TAB ===================> */}
      {currentTab === "reset_password" && (
        <div className="relative w-full max-w-md mx-auto z-10">
          {/* LUXURY GLASS CARD */}
          <div className="relative bg-[#161311]/90 backdrop-blur-2xl border border-primary/25 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/80 overflow-hidden">
            {/* TOP ACCENT LINE */}
            <div
              className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent"
              aria-hidden="true"
            />

            {/* KEY ICON BADGE */}
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 text-primary text-2xl shadow-lg shadow-primary/10">
              <FiKey />
            </div>

            {/* HEADING */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif text-heading-main font-normal tracking-wide">
                Forgot Password?
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-xs mx-auto">
                Enter your registered email address and we&apos;ll send you a
                verification code.
              </p>
            </div>

            {/* FORM */}
            <CustomForm
              schema={resetPasswordEmailSchema}
              defaultValues={{ email: "" }}
              submitHandler={handleEmailSubmit}
              showFormActionButton={false}
              className="flex flex-col gap-4"
            >
              {/* EMAIL */}
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={FiMail}
                required
              />

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer group"
              >
                {isEmailLoading ? (
                  <>
                    <ButtonSpinner />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <FiArrowRight className="text-lg group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </CustomForm>

            {/* BACK TO LOGIN */}
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-400 hover:text-primary transition-colors font-medium"
              >
                <FiArrowLeft className="text-sm" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* <=================== RESET PASSWORD CODE TAB ===================> */}
      {currentTab === "code" && (
        <div className="relative w-full max-w-md mx-auto z-10">
          <VerificationCode
            data={{ email }}
            onSuccess={() => setCurrentTab("new_password")}
          />
        </div>
      )}

      {/* <=================== SET NEW PASSWORD TAB ===================> */}
      {currentTab === "new_password" && (
        <NewPasswordForm
          formData={{ password: "", password_confirmation: "" }}
          isLoading={isPasswordLoading}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
}
