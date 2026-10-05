"use client";

import React from "react";
import PropTypes from "prop-types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormActionButton from "./FormActionButton";

export function CustomForm({
  schema,
  defaultValues,
  submitHandler,
  children,
  className = "",
  actionButtonClassName = "",
  cancelHandler,
  showFormActionButton = true,
  submitButtonLabel = "Submit",
  cancelButtonLabel = "Cancel",
  resetOnSuccess = false,
  style,
}) {
  const formConfig = {};
  if (schema) {
    formConfig.resolver = zodResolver(schema);
  }
  if (defaultValues) {
    formConfig.values = defaultValues;
  }

  const methods = useForm(formConfig);

  const {
    handleSubmit,
    setError,
    reset,
    formState: { isLoading, isSubmitting, isValidating },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await Promise.resolve(submitHandler(data));
      if (resetOnSuccess) {
        reset();
      }
    } catch (err) {
      // Retain entered values on error
      reset(undefined, { keepValues: true });

      const errorStatus = err?.response?.status || err?.status;
      if (errorStatus === 422) {
        // Parse backend validation error object (e.g., { email: ["Invalid email"] })
        const errors = err?.response?.data?.errors || err?.data?.errors;

        if (errors && typeof errors === "object") {
          Object.keys(errors).forEach((field) => {
            const fieldErrors = errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((errorMessage) => {
                setError(field, {
                  type: "server",
                  message: errorMessage,
                });
              });
            } else if (typeof fieldErrors === "string") {
              setError(field, { type: "server", message: fieldErrors });
            }
          });
        }
      } else {
        // Re-throw other errors to allow caller or error toast to handle
        throw err;
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={className}
        style={style}
        noValidate
      >
        {children}
        {showFormActionButton && (
          <FormActionButton
            isLoading={isLoading || isValidating || isSubmitting}
            cancelHandler={cancelHandler}
            className={actionButtonClassName}
            label={submitButtonLabel}
            cancelLabel={cancelButtonLabel}
          />
        )}
      </form>
    </FormProvider>
  );
}

CustomForm.propTypes = {
  schema: PropTypes.object,
  defaultValues: PropTypes.object,
  submitHandler: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  actionButtonClassName: PropTypes.string,
  cancelHandler: PropTypes.func,
  showFormActionButton: PropTypes.bool,
  submitButtonLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  resetOnSuccess: PropTypes.bool,
  style: PropTypes.object,
};

export default CustomForm;
