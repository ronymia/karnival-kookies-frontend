"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiArrowRight } from "react-icons/fi";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import { CustomForm, InputField, PasswordInputField } from "@/components/form";
import { loginSchema } from "../schema";
import { useLoginForm } from "../hooks/useLoginForm";
import VerificationCode from "../components/VerificationCode";

export default function LoginScreen() {
  const {
    currentTab,
    unverifiedEmail,
    isLoading,
    handleOnSubmit,
  } = useLoginForm();

  const [rememberMe, setRememberMe] = useState(false);

  // Set Page Title
  useEffect(() => {
    document.title = "Karnival Cookies | Login";
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-12 sm:px-6 overflow-hidden">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-12 right-12 w-72 h-72 bg-[#e6aa38]/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-12 left-12 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* <=================== LOGIN TAB ===================> */}
      {currentTab === "login" && (
        <div className="relative w-full max-w-md mx-auto z-10">
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
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1.5 max-w-xs">
                Sign in to indulge in your favorite handcrafted cookies & treats.
              </p>
            </div>

            {/* FORM */}
            <CustomForm
              schema={loginSchema}
              defaultValues={{
                email: "",
                password: "",
              }}
              submitHandler={handleOnSubmit}
              showFormActionButton={false}
              className="flex flex-col gap-4"
            >
              {/* EMAIL */}
              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={FiMail}
                required
              />

              {/* PASSWORD */}
              <PasswordInputField
                name="password"
                label="Password"
                placeholder="••••••••"
                required
              />

              {/* REMEMBER ME & FORGOT PASSWORD */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-neutral-400 hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-primary/30 bg-[#151312] text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <Link
                  href="/reset-password"
                  className="text-primary hover:text-primary-focus font-medium transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-linear-to-r from-[#e6aa38] via-primary to-[#b87c1e] text-black font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer group"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="text-lg group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>

              {/* DIVIDER */}
              <div className="relative my-3">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#161311] px-3 text-neutral-500 font-light">
                    New to Karnival Kookies?
                  </span>
                </div>
              </div>

              {/* CREATE ACCOUNT LINK BUTTON */}
              <Link
                href="/register"
                className="w-full text-center py-3 px-5 rounded-full border border-primary/30 hover:border-primary bg-transparent hover:bg-primary/5 text-white/90 hover:text-white text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
              >
                Create an Account
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
              <span className="text-primary">🔒</span> Secure Checkout
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-primary">🍪</span> Freshly Baked
            </span>
          </div>
        </div>
      )}

      {/* <=================== EMAIL VERIFICATION CODE ===================> */}
      {currentTab === "code" && (
        <div className="relative w-full max-w-md mx-auto z-10">
          <VerificationCode data={{ email: unverifiedEmail }} />
        </div>
      )}
    </div>
  );
}
