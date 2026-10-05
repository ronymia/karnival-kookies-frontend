"use client";

import { FiSend, FiCheckCircle } from "react-icons/fi";
import {
  CustomForm,
  InputField,
  SelectInputField,
  TextareaInputField,
} from "@/components/form";
import useContactForm from "../hooks/useContactForm";
import { contactSchema } from "../schema";
import { INQUIRY_TYPES } from "../services";

export default function ContactForm() {
  const {
    defaultValues,
    submitHandler,
    isSubmitting,
    isSuccess,
    resetSuccess,
  } = useContactForm();

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-3xl bg-[#161311]/90 border border-primary/25 backdrop-blur-xl shadow-2xl shadow-black/60 p-6 sm:p-10 md:p-12 overflow-hidden">
      {/* AMBIENT GLOW */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT COLUMN: BRAND PROMISE & INFO */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider">
              ✦ Fast Response
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Let&apos;s Bake Something Special Together
            </h3>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Have a question about our secret menu recipes, need gourmet catering for your next event, or want to send a handcrafted gift box? Our team is here to assist you.
            </p>
          </div>

          {/* QUICK PROMISES */}
          <div className="space-y-3 pt-2">
            {[
              {
                title: "Custom Orders & Special Requests",
                desc: "Personalized cookie flavors, tiered towers, and wedding boxes.",
              },
              {
                title: "Event & Corporate Catering",
                desc: "Fresh morning deliveries for gatherings and celebrations.",
              },
              {
                title: "Quality Guarantee",
                desc: "Baked with pure European butter and single-origin chocolate.",
              },
            ].map((promise, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 animate-pulse" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    {promise.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                    {promise.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REACT HOOK FORM (CUSTOMFORM) */}
        <div className="lg:col-span-7">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-12 px-4 rounded-2xl bg-white/[0.02] border border-primary/20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center text-3xl">
                <FiCheckCircle />
              </div>
              <h4 className="font-serif text-2xl text-white">
                Message Received!
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-sm">
                Thank you for reaching out. A member of our artisanal bakery team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={resetSuccess}
                className="mt-4 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-black text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <CustomForm
              schema={contactSchema}
              defaultValues={defaultValues}
              submitHandler={submitHandler}
              resetOnSuccess={true}
              showFormActionButton={false}
              className="space-y-4 sm:space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* FULL NAME */}
                <InputField
                  name="name"
                  label="Full Name"
                  placeholder="e.g. Eleanor Vance"
                  required
                />

                {/* EMAIL */}
                <InputField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PHONE */}
                <InputField
                  name="phone"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                />

                {/* INQUIRY TYPE */}
                <SelectInputField
                  name="inquiryType"
                  label="Inquiry Type"
                  options={INQUIRY_TYPES}
                />
              </div>

              {/* MESSAGE TEXTAREA */}
              <TextareaInputField
                name="message"
                label="Your Message"
                placeholder="Tell us about your event, flavors you love, or questions you have..."
                required
                rows={4}
              />

              {/* SUBMIT BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="text-sm" />
                    </>
                  )}
                </button>
              </div>
            </CustomForm>
          )}
        </div>
      </div>
    </div>
  );
}
