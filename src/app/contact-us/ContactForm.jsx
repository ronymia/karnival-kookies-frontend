/* eslint-disable promise/catch-or-return */
"use client";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import Button from "@/components/ui/buttons/Button";
import InputField from "@/components/ui/inputfields/InputField";
import TextareaField from "@/components/ui/inputfields/TextareaField";

export default function ContactForm() {
  const formRef = useRef();
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

  const [isMessageSending, setIsMessageSending] = useState(false);
  // SUBMIT DATA

  const sendEmail = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsMessageSending(true);
      emailjs
        .sendForm(
          process.env.NEXT_PUBLIC_SERVICE_ID,
          process.env.NEXT_PUBLIC_TEMPLATE_ID,
          formRef.current,
          {
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
          }
        )
        .then(
          () => {
            setIsMessageSending(false);
            // CREATE FORM DATA
            setFormData({
              name: "",
              email: "",
              message: "",
            });

            // SUCCESS MESSAGE
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"success"}
                text={`Message sent successfully`}
              />
            ));
          },
          (error) => {
            setIsMessageSending(false);
            toast.custom((t) => (
              <CustomToaster
                t={t}
                type={"error"}
                text={error?.text || "Something went wrong"}
              />
            ));
          }
        );
    }
  };

  if (isMessageSending) {
    return <CustomLoading />;
  }
  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={sendEmail}
      className={` pb-12 h-full grid grid-cols-1 md:grid-cols-2 md:gap-5`}
    >
      {/* NAME */}
      <InputField
        value={formData?.name}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.name}
        id={"name"}
        label={"Name"}
        name={"user_username"}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
        }}
        placeholder={"Name"}
        type={"text"}
        wrapperClassName={"w-full"}
        required={true}
      />
      {/* EMAIL */}
      <InputField
        value={formData?.email}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.email}
        id={"email"}
        label={"Email"}
        name={"user_email"}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder={"Email"}
        type={"email"}
        wrapperClassName={"w-full"}
        required={true}
      />
      {/* MESSAGE */}
      <TextareaField
        value={formData?.message}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.message}
        id={"message"}
        label={"Message"}
        name={"user_message"}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder={"Message"}
        type={"text"}
        wrapperClassName={"w-full md:col-span-2"}
        required
      />
      <div className="md:col-span-2 flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <Button
          type="submit"
          text={"Submit"}
          // handler={handleSubmit}
          isLoading={isMessageSending}
        />
      </div>
    </form>
  );
}
