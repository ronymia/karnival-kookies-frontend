"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import InputField from "@/components/ui/inputfields/InputField";
import PasswordField from "@/components/ui/inputfields/PasswordField";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import { useLoginForm } from "../hooks/useLoginForm";
import VerificationCode from "../components/VerificationCode";

export default function LoginScreen() {
  const {
    currentTab,
    formData,
    errors,
    isLoading,
    handleFormChange,
    handleOnSubmit,
  } = useLoginForm();

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Login";
  }, []);

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <>
      {/* <=================== LOGIN TAB ===================> */}
      {currentTab === "login" && (
        <div className="block overflow-auto pt-32 pb-60 space-y-10">
          <h2 className="text-xl font-bold text-center">Login</h2>

          {/* LOGIN FORM AREA */}
          <form
            noValidate
            onSubmit={handleOnSubmit}
            className="max-w-[360px] mx-auto flex flex-col gap-6"
          >
            <h2 className="text-xl font-bold">Welcome Back</h2>

            {/* EMAIL */}
            <InputField
              value={formData?.email}
              disable={false}
              fieldClassName="w-full"
              error={errors?.email}
              id="email"
              name="email"
              label="Email"
              onChange={handleFormChange}
              placeholder="Email"
              type="email"
              wrapperClassName="w-full"
              required
            />

            {/* PASSWORD */}
            <PasswordField
              required
              id="password"
              onChange={handleFormChange}
              value={formData?.password}
              placeholder="Password"
              name="password"
              error={errors?.password}
              wrapperClassName="w-full"
              fieldClassName="w-full"
              label="Password"
            />

            {/* FORGOT PASSWORD */}
            <Link
              href="/reset-password"
              className="text-right link link-hover text-btn-primary block"
            >
              Forgot password?
            </Link>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-center items-center group">
              <button
                type="submit"
                disabled={isLoading}
                className="text-primary border border-primary px-5 py-3 rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]"
              >
                {isLoading ? (
                  <ButtonSpinner />
                ) : (
                  <>
                    <p className="group-hover:text-base-300 transition-[color] duration-700">
                      Login
                    </p>
                    <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>

            {/* CREATE ACCOUNT */}
            <div className="font-bold text-heading-main pb-10">
              <span>First time here? </span>{" "}
              <Link
                href="/register"
                className="link link-hover text-btn-primary"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* <=================== EMAIL VERIFICATION CODE ===================> */}
      {currentTab === "code" && <VerificationCode data={formData} />}
    </>
  );
}
