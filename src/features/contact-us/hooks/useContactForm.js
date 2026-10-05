"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { ContactService } from "../services";

/**
 * Custom hook to handle contact form submission and state for CustomForm.
 */
export default function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues = ContactService.getDefaultFormData();

  const submitHandler = async (data) => {
    setIsSubmitting(true);

    const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    // Fallback for local development if keys are unconfigured
    if (!serviceId || !templateId || !publicKey) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text="Thank you! Your message has been received."
        />
      ));
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_username: data.name,
          user_email: data.email,
          user_phone: data.phone || "N/A",
          inquiry_type: data.inquiryType,
          user_message: data.message,
        },
        publicKey
      );

      setIsSubmitting(false);
      setIsSuccess(true);

      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="success"
          text="Your message has been sent to our bakery team!"
        />
      ));
    } catch (err) {
      setIsSubmitting(false);
      toast.custom((t) => (
        <CustomToaster
          t={t}
          type="error"
          text={
            err?.text ||
            "Failed to send message. Please try calling or emailing directly."
          }
        />
      ));
      throw err;
    }
  };

  const resetSuccess = () => {
    setIsSuccess(false);
  };

  return {
    defaultValues,
    submitHandler,
    isSubmitting,
    isSuccess,
    resetSuccess,
  };
}
