"use client";

import { useSubscriptionForNewsletterMutation } from "@/redux/apis/newsletterApis";
import { useState } from "react";
import toast from "react-hot-toast";
import CustomToaster from "../ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { FiSend } from "react-icons/fi";

export default function NewsletterSection() {
  const [subscription, subscribeResult] =
    useSubscriptionForNewsletterMutation();
  const [error, setError] = useState(null);
  const [emailInput, setEmailInput] = useState("");

  const validateForm = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const email = emailInput.trim();

    if (!validateForm(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const result = await subscription({ email }).unwrap();

      if (result?.data) {
        toast.custom((t) => (
          <CustomToaster
            t={t}
            type="success"
            text="You have subscribed for our weekly treats & offers!"
          />
        ));
        setEmailInput("");
      }
    } catch (err) {
      errorHandler({ err });
      setError(err?.data?.message || "Subscription failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 block mb-1.5">
          VIP Club
        </span>
        <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
          Stay Connected
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Subscribe to receive secret menu releases, holiday drops, and sweet
          member-only discounts.
        </p>
      </div>

      <form onSubmit={handleOnSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            id="Subscribe-email"
            name="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              if (error) setError(null);
            }}
            disabled={subscribeResult.isLoading}
            placeholder="Enter your email..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm placeholder:text-neutral-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={subscribeResult.isLoading}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            {subscribeResult.isLoading ? (
              <span>Subscribing...</span>
            ) : (
              <>
                <span>Subscribe</span>
                <FiSend className="text-xs" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-1 font-medium">{error}</p>
        )}
      </form>
    </div>
  );
}
