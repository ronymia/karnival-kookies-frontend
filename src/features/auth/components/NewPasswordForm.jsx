"use client";

import { CustomForm, PasswordInputField } from "@/components/form";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import Link from "next/link";
import PropTypes from "prop-types";
import { FiArrowLeft, FiCheck, FiLock } from "react-icons/fi";
import { newPasswordSchema } from "../schema";

export default function NewPasswordForm({
  formData,
  errors,
  isLoading,
  onSubmit,
}) {
  return (
    <div className="relative w-full max-w-md mx-auto z-10">
      {/* LUXURY GLASS CARD */}
      <div className="relative bg-[#161311]/90 backdrop-blur-2xl border border-primary/25 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/80 overflow-hidden">
        {/* TOP ACCENT LINE */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent"
          aria-hidden="true"
        />

        {/* ICON BADGE */}
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 text-primary text-2xl shadow-lg shadow-primary/10">
          <FiLock />
        </div>

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif text-heading-main font-normal tracking-wide">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-xs mx-auto">
            Choose a strong password to secure your account and orders.
          </p>
        </div>

        {/* FORM */}
        <CustomForm
          schema={newPasswordSchema}
          defaultValues={{
            password: formData?.password || "",
            password_confirmation: formData?.password_confirmation || "",
          }}
          submitHandler={onSubmit}
          showFormActionButton={false}
          className="flex flex-col gap-4"
        >
          {/* PASSWORD */}
          <PasswordInputField
            name="password"
            label="New Password"
            placeholder="••••••••"
            required
            helperText="At least 8 chars with uppercase, lowercase & number"
          />

          {/* CONFIRM PASSWORD */}
          <PasswordInputField
            name="password_confirmation"
            label="Confirm Password"
            placeholder="••••••••"
            required
          />

          {/* SERVER ERROR DISPLAY */}
          {errors?.password && (
            <p role="alert" className="text-xs text-red-400 font-medium">
              {errors.password}
            </p>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer group"
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <FiCheck className="text-lg group-hover:scale-110 transition-transform duration-300" />
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
  );
}

NewPasswordForm.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
