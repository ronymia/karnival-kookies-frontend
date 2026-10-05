"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiMap,
  FiGlobe,
  FiHash,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import { Controller } from "react-hook-form";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import {
  CustomForm,
  InputField,
  PasswordInputField,
  InputLabel,
  InputError,
} from "@/components/form";
import { registerSchema } from "../schema";
import { useRegisterForm } from "../hooks/useRegisterForm";
import VerificationCode from "../components/VerificationCode";

export default function RegisterScreen() {
  const {
    currentTab,
    unverifiedEmail,
    isLoading,
    handleOnSubmit,
  } = useRegisterForm();

  // Set Page Title
  useEffect(() => {
    document.title = "Karnival Cookies | Sign Up";
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 sm:px-6 overflow-hidden">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-12 right-12 w-80 h-80 bg-[#e6aa38]/5 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-12 left-12 w-80 h-80 bg-primary/5 rounded-full blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      {/* <=================== REGISTER TAB ===================> */}
      {currentTab === "register" && (
        <div className="relative w-full max-w-2xl mx-auto z-10">
          {/* LUXURY GLASS CARD */}
          <div className="relative bg-[#161311]/90 backdrop-blur-2xl border border-primary/25 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/80 overflow-hidden">
            {/* TOP GOLD GRADIENT ACCENT BORDER */}
            <div
              className="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-transparent via-primary/70 to-transparent"
              aria-hidden="true"
            />

            {/* BRAND LOGO & HEADER */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link
                href="/"
                className="group relative mb-3 transition-transform hover:scale-105 active:scale-95"
              >
                <div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all"
                  aria-hidden="true"
                />
                <Image
                  src="/cremeLogo.png"
                  alt="Karnival Kookies Logo"
                  width={68}
                  height={68}
                  priority
                  className="relative drop-shadow-md"
                />
              </Link>

              <h1 className="text-3xl sm:text-4xl font-serif text-heading-main font-normal tracking-wide">
                Create an Account
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-md mx-auto">
                Join Karnival Kookies to unlock artisan cookie boxes, rewards & fast delivery.
              </p>
            </div>

            {/* REGISTER FORM */}
            <CustomForm
              schema={registerSchema}
              defaultValues={{
                name: "",
                email: "",
                phone: "",
                address: "",
                country: "",
                city: "",
                postcode: "",
                date_of_birth: "",
                gender: "",
                password: "",
                role: "customer",
              }}
              submitHandler={handleOnSubmit}
              showFormActionButton={false}
              className="flex flex-col gap-5"
            >
              {/* 2-COLUMN GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* NAME */}
                <InputField
                  name="name"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={FiUser}
                  required
                />

                {/* PHONE */}
                <InputField
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  icon={FiPhone}
                  required
                />

                {/* EMAIL */}
                <InputField
                  name="email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  icon={FiMail}
                  required
                />

                {/* ADDRESS */}
                <InputField
                  name="address"
                  label="Street Address"
                  placeholder="123 Baker Street"
                  icon={FiMapPin}
                  required
                />

                {/* CITY */}
                <InputField
                  name="city"
                  label="City"
                  placeholder="New York"
                  icon={FiMap}
                  required
                />

                {/* COUNTRY */}
                <InputField
                  name="country"
                  label="Country"
                  placeholder="United States"
                  icon={FiGlobe}
                  required
                />

                {/* POSTCODE */}
                <InputField
                  name="postcode"
                  label="Postcode / Zip"
                  placeholder="10001"
                  icon={FiHash}
                  required
                />

                {/* DATE OF BIRTH */}
                <InputField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  icon={FiCalendar}
                  required
                />

                {/* GENDER SELECTION */}
                <div className="flex flex-col gap-1.5 w-full">
                  <InputLabel label="Gender" htmlFor="gender" required />
                  <Controller
                    name="gender"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col gap-1">
                        <div className="grid grid-cols-2 gap-3">
                          {["male", "female"].map((option) => {
                            const isSelected = field.value === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => field.onChange(option)}
                                className={`py-3 px-4 rounded-xl text-sm font-semibold capitalize flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-primary/15 border-primary text-primary shadow-inner ring-1 ring-primary/30"
                                    : "bg-[#151312] border-primary/25 text-white/70 hover:border-primary/40 hover:text-white"
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-neutral-500 bg-transparent"
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                  )}
                                </span>
                                <span>{option}</span>
                              </button>
                            );
                          })}
                        </div>
                        <InputError error={error?.message} />
                      </div>
                    )}
                  />
                </div>

                {/* PASSWORD */}
                <PasswordInputField
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3.5 px-6 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer group"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="text-lg group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>

              {/* DIVIDER */}
              <div className="relative my-2">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#161311] px-3 text-neutral-500 font-light">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* LOGIN LINK BUTTON */}
              <Link
                href="/login"
                className="w-full text-center py-3 px-5 rounded-full border border-primary/30 hover:border-primary bg-transparent hover:bg-primary/5 text-white/90 hover:text-white text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
              >
                Sign In Instead
              </Link>
            </CustomForm>
          </div>

          {/* TRUST / ASSURANCE PILLS */}
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 mt-6 select-none">
            <span className="flex items-center gap-1.5">
              <span className="text-primary">✨</span> 100% Handcrafted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary">🔒</span> Secure Registration
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary">🍪</span> Member Exclusive Perks
            </span>
          </div>
        </div>
      )}

      {/* <=================== EMAIL VERIFICATION TAB ===================> */}
      {currentTab === "code" && (
        <div className="relative w-full max-w-md mx-auto z-10">
          <VerificationCode data={{ email: unverifiedEmail }} />
        </div>
      )}
    </div>
  );
}
