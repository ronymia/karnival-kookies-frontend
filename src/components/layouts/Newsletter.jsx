"use client";

import { useSubscriptionForNewsletterMutation } from "@/redux/apis/newsletterApis";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "../UI/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";

const NewsletterSection = () => {
  const [subscription, subscribeResult] =
    useSubscriptionForNewsletterMutation();
  const [error, setError] = useState(null);

  const validateForm = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    const formData = new FormData(event.target);
    const email = formData.get("email");

    const isValid = await validateForm(email);
    if (!isValid) {
      setError("Invalid email address.");
      return;
    }

    try {
      const result = await subscription({ email }).unwrap();

      console.log({ result });
      if (result?.data) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type={"success"}
            text={`You have subscription for weekly mail`}
          />
        ));
      }
    } catch (err) {
      console.log("Subscription failed:", err);
      //
      errorHandler({ err });

      setError(err?.data?.message);
    }
  };

  return (
    <div className=" py-8 px-4 text-primary h-full z-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Stay Connected</h2>
        <p className="mt-2">Exclusive offers</p>
        <p>Subscribe to our news and get updated about exclusive offers!</p>
      </div>
      <form onSubmit={handleOnSubmit} className="mt-6 flex justify-center">
        <input
          type="email"
          id={`Subscribe-email`}
          name={`email`}
          disabled={subscribeResult.loading}
          placeholder="E-mail"
          className="w-full max-w-md px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary 
          focus:border-primary transition duration-300"
        />
        <button
          type="submit"
          disabled={subscribeResult.loading}
          className="bg-primary text-white px-6 py-2 rounded-r-full font-semibold hover:bg-primary transition duration-300"
        >
          Subscribe
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default NewsletterSection;
