"use client";

import PropTypes from "prop-types";
import Button from "@/components/ui/buttons/Button";
import CustomNumberFieldForOtp from "@/shared/fields/CustomNumberFieldForOtp";

export default function ResetPasswordCode({
  email,
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-10 p-5 pt-32 pb-60">
      <header className="space-y-2 text-center">
        <h2 className="text-xl font-bold">Enter Verification Code</h2>
        <p className="font-medium text-[14px]">
          We have Sent a Code to {email}
        </p>
      </header>

      <form
        noValidate
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center gap-3"
      >
        <div className="flex gap-2">
          <CustomNumberFieldForOtp
            value={formData?.digit_1}
            disable={false}
            fieldClassName="w-12"
            id="digit_1"
            name="digit_1"
            placeholder=""
            onChange={(e) => onChange(e, "digit_2", "digit_1")}
            wrapperClassName="w-12"
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_2}
            disable={false}
            fieldClassName="w-12"
            id="digit_2"
            name="digit_2"
            placeholder=""
            onChange={(e) => onChange(e, "digit_3", "digit_1")}
            wrapperClassName="w-12"
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_3}
            disable={false}
            fieldClassName="w-12"
            id="digit_3"
            name="digit_3"
            placeholder=""
            onChange={(e) => onChange(e, "digit_4", "digit_2")}
            wrapperClassName="w-12"
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_4}
            disable={false}
            fieldClassName="w-12"
            id="digit_4"
            name="digit_4"
            placeholder=""
            onChange={(e) => onChange(e, "digit_4", "digit_3")}
            wrapperClassName="w-12"
            maxLength={1}
          />
        </div>

        {/* ERROR MESSAGE */}
        {(errors?.digit || errors?.verifyError) && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors?.digit || errors?.verifyError}
            </span>
          </label>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center items-center">
          <Button
            type="submit"
            text="Submit"
            isLoading={isLoading}
          />
        </div>
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
