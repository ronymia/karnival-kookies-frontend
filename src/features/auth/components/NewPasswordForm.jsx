"use client";

import PropTypes from "prop-types";
import Button from "@/components/ui/buttons/Button";
import PasswordField from "@/components/ui/inputfields/PasswordField";

export default function NewPasswordForm({
  formData,
  errors,
  isLoading,
  onChange,
  onSubmit,
}) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="max-w-md mx-auto flex flex-col gap-10 p-5 pt-32 pb-60"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold">Reset your password</h2>
      </div>
      <div className="space-y-2 flex flex-col justify-center items-center">
        {/* PASSWORD */}
        <PasswordField
          required
          id="password"
          onChange={onChange}
          value={formData?.password}
          label="Password"
          placeholder="Password"
          name="password"
          error={errors?.password}
          wrapperClassName="w-full"
          fieldClassName="w-full"
        />
        {/* PASSWORD CONFIRMATION */}
        <PasswordField
          required
          id="password_confirmation"
          onChange={onChange}
          value={formData?.password_confirmation}
          label="Confirm Password"
          placeholder="Password"
          name="password_confirmation"
          error={errors?.password_confirmation}
          wrapperClassName="w-full"
          fieldClassName="w-full"
        />
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center items-center">
        <Button
          type="submit"
          text="Submit"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

NewPasswordForm.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
