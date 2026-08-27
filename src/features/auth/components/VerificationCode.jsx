"use client";

import PropTypes from "prop-types";
import CustomNumberFieldForOtp from "@/shared/fields/CustomNumberFieldForOtp";
import { IoIosArrowRoundForward } from "react-icons/io";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import { useVerificationCode } from "../hooks/useVerificationCode";

export default function VerificationCode({ data }) {
  const { formData, errors, isLoading, handleFormChange, handleOnSubmit } =
    useVerificationCode({ email: data?.email });

  return (
    <div
      className="flex flex-col justify-center items-center gap-10 p-5 pt-32 pb-60"
    >
      {/* <=================== HEADING ===================> */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold">Enter Verification Code</h2>
        <p className="font-medium text-sm">
          We Have Sent a Code to{" "}
          <span className="font-bold text-primary text-base">
            {data?.email}
          </span>
        </p>
      </div>

      {/* <=================== FORM ===================> */}
      <form
        noValidate
        onSubmit={handleOnSubmit}
        className="flex flex-col gap-5 justify-center items-center"
      >
        <div className="flex gap-2">
          <CustomNumberFieldForOtp
            value={formData?.digit_1}
            disable={false}
            fieldClassName="w-12"
            id="digit_1"
            name="digit_1"
            placeholder=""
            onChange={(e) => handleFormChange(e, "digit_2", "digit_1")}
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
            onChange={(e) => handleFormChange(e, "digit_3", "digit_1")}
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
            onChange={(e) => handleFormChange(e, "digit_4", "digit_2")}
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
            onChange={(e) => handleFormChange(e, "digit_4", "digit_3")}
            wrapperClassName="w-12"
            maxLength={1}
          />
        </div>

        {/* ERROR */}
        {(errors?.digit || errors?.verifyError) && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors?.digit || errors?.verifyError}
            </span>
          </label>
        )}

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center items-center group">
          <button
            type="submit"
            disabled={isLoading}
            className="text-primary border border-primary px-5 py-3 rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]"
          >
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <>
                <p className="group-hover:text-base-300 transition-[color] duration-700">
                  Submit
                </p>
                <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

VerificationCode.propTypes = {
  data: PropTypes.shape({
    email: PropTypes.string,
  }),
};
