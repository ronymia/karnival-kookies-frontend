"use client";

import PropTypes from "prop-types";
import { FiArrowRight, FiShield } from "react-icons/fi";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import { OtpInputField } from "@/components/form";

export default function ResetPasswordCode({
  email,
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
}) {
  return (
    <div className="relative bg-[#161311]/90 backdrop-blur-2xl border border-primary/25 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/80 overflow-hidden text-center max-w-md w-full mx-auto">
      {/* TOP ACCENT LINE */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent"
        aria-hidden="true"
      />

      {/* ICON BADGE */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 text-primary text-2xl shadow-lg shadow-primary/10">
        <FiShield />
      </div>

      {/* HEADING */}
      <div className="space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-serif text-heading-main font-normal tracking-wide">
          Enter Verification Code
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xs mx-auto">
          We have sent a 4-digit code to{" "}
          <span className="font-semibold text-primary">{email}</span>
        </p>
      </div>

      {/* FORM */}
      <form
        noValidate
        onSubmit={onSubmit}
        className="flex flex-col gap-6 justify-center items-center"
      >
        <OtpInputField
          length={4}
          value={formData}
          onChange={onChange}
          disabled={isLoading}
          error={!!(errors?.digit || errors?.verifyError)}
        />

        {/* ERROR MESSAGE */}
        {(errors?.digit || errors?.verifyError) && (
          <p role="alert" className="text-xs text-red-400 font-medium -mt-2">
            {errors?.digit || errors?.verifyError}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer group"
        >
          {isLoading ? (
            <>
              <ButtonSpinner />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <FiArrowRight className="text-lg group-hover:translate-x-1.5 transition-transform duration-300" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

ResetPasswordCode.propTypes = {
  email: PropTypes.string,
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
