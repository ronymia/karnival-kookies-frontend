"use client";
import { useState } from "react";
import toast from "react-hot-toast";

import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import { errorHandler } from "@/Utils/errorHandler";
import CustomField from "@/Shared/Fields/CustomField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import ButtonSpinner from "@/Shared/ButtonSpinner";
import { postMessage } from "@/apis/messages";
import Button from "@/Shared/Button";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email is required";
    }
    if (!formData.message || formData.message.trim() === "") {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    console.log({ newErrors });
    // ValidationErrorHandler(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type={"error"}
          errors={{
            validationErrors: Object.entries(newErrors).map((error, i) => {
              if (Array.isArray(error[1])) {
                return Object.entries(error[1][0])
                  ?.filter((error2, j) => error2[0] !== "id")
                  ?.map((error2, j) => error2[1])
                  ?.join(" & ");
              } else {
                return error[1];
              }
            }),
          }}
          text={`You are submitting invalid data`}
        />
      ));
    }

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isMessageSending, setIsMessageSending] = useState(false);
  // SUBMIT DATA
  const handleSubmit = async () => {
    // Validate form
    if (validateForm()) {
      setIsMessageSending(true);
      postMessage(formData)
        .then((res) => {
          console.log({ res });
          if (res?.success) {
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"success"}
                text={`Message sent successfully`}
              />
            ));

            setFormData({
              name: "",
              email: "",
              message: "",
            });
            setIsMessageSending(false);
          }
        })
        .catch((err) => {
          errorHandler({ err, setLoading: setIsMessageSending });
        });
    }
  };

  if (isMessageSending) {
    return <CustomLoading />;
  }
  return (
    <div className={` pb-12 h-full flex flex-col justify-between`}>
      <div className={`grid grid-cols-1 md:grid-cols-2 md:gap-5`}>
        {/* NAME */}
        <CustomField
          defaultValue={formData?.name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.name}
          id={"name"}
          label={"Name"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Name"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* EMAIL */}
        <CustomField
          defaultValue={formData?.email}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.email}
          id={"email"}
          label={"Email"}
          name={"email"}
          onChange={handleFormChange}
          placeholder={"Email"}
          type={"email"}
          wrapperClassName={"w-full"}
          required={true}
        />
      </div>
      {/* MESSAGE */}
      <CustomTextareaField
        defaultValue={formData?.message}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.message}
        id={"message"}
        label={"Message"}
        name={"message"}
        onChange={handleFormChange}
        placeholder={"Message"}
        type={"text"}
        wrapperClassName={"w-full"}
        required
      />
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <Button
          text={"Submit"}
          handler={handleSubmit}
          isLoading={isMessageSending}
        />
      </div>
    </div>
  );
};

export default ContactForm;
