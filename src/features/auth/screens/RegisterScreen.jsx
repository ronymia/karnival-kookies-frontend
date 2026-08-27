"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BiSolidCheckCircle } from "react-icons/bi";
import Heading from "@/components/ui/heading/Heading";
import DatePicker from "@/components/ui/inputfields/DatePicker";
import InputField from "@/components/ui/inputfields/InputField";
import NumberField from "@/components/ui/inputfields/NumberField";
import PasswordField from "@/components/ui/inputfields/PasswordField";
import RadioButton from "@/components/ui/inputfields/RadioButton";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import { useRegisterForm } from "../hooks/useRegisterForm";
import VerificationCode from "../components/VerificationCode";

export default function RegisterScreen() {
  const {
    currentTab,
    formData,
    errors,
    isLoading,
    handleFormChange,
    handleDateChange,
    handleOnSubmit,
  } = useRegisterForm();

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Sign up";
  }, []);

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <>
      {/* <=================== REGISTER TAB ===================> */}
      {currentTab === "register" && (
        <div className="block overflow-auto pt-32 pb-60 space-y-10">
          <Heading heading="Create An Account" isSubHeading={false} />

          {/* REGISTER FORM AREA */}
          <form
            noValidate
            onSubmit={handleOnSubmit}
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* NAME */}
            <InputField
              value={formData?.name}
              disable={false}
              fieldClassName="w-full"
              error={errors?.name}
              id="name"
              name="name"
              label="Name"
              onChange={handleFormChange}
              placeholder="Name"
              type="text"
              wrapperClassName="w-full"
              required
            />

            {/* PHONE */}
            <NumberField
              value={formData?.phone}
              disable={false}
              fieldClassName="w-full"
              error={errors?.phone}
              id="phone"
              label="Phone"
              name="phone"
              onChange={handleFormChange}
              placeholder="Phone"
              wrapperClassName="w-full"
            />

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

            {/* ADDRESS */}
            <InputField
              value={formData?.address}
              disable={false}
              fieldClassName="w-full"
              error={errors?.address}
              id="address"
              name="address"
              label="Address"
              onChange={handleFormChange}
              placeholder="Address"
              type="text"
              wrapperClassName="w-full"
              required
            />

            {/* COUNTRY */}
            <InputField
              value={formData?.country}
              disable={false}
              fieldClassName="w-full"
              error={errors?.country}
              id="country"
              name="country"
              label="Country"
              onChange={handleFormChange}
              placeholder="Country"
              type="text"
              wrapperClassName="w-full"
              required
            />

            {/* CITY */}
            <InputField
              value={formData?.city}
              disable={false}
              fieldClassName="w-full"
              error={errors?.city}
              id="city"
              name="city"
              label="City"
              onChange={handleFormChange}
              placeholder="City"
              type="text"
              wrapperClassName="w-full"
              required
            />

            {/* POSTCODE */}
            <InputField
              value={formData?.postcode}
              disable={false}
              fieldClassName="w-full"
              error={errors?.postcode}
              id="postcode"
              name="postcode"
              label="Postcode"
              onChange={handleFormChange}
              placeholder="Postcode"
              type="text"
              wrapperClassName="w-full"
              required
            />

            {/* DATE OF BIRTH */}
            <DatePicker
              right
              id="date_of_birth"
              name="date_of_birth"
              label="Date of birth"
              placeholder="Date of birth"
              required
              onChange={handleDateChange}
              defaultDate={formData?.date_of_birth}
              error={errors?.date_of_birth}
            />

            {/* GENDER */}
            <RadioButton
              options={[
                {
                  name: "gender",
                  title: "Male",
                  value: "male",
                  Icon: BiSolidCheckCircle,
                },
                {
                  name: "gender",
                  title: "Female",
                  value: "female",
                  Icon: BiSolidCheckCircle,
                },
              ]}
              onChange={handleFormChange}
              wrapperClassName=""
              inputFieldClassName="grid-cols-2 gap-5"
              label="Gender"
              required
              defaultChecked={formData?.gender}
              error={errors?.gender}
            />

            {/* PASSWORD */}
            <PasswordField
              required
              id="password"
              onChange={handleFormChange}
              value={formData?.password}
              label="Password"
              placeholder="Password"
              name="password"
              error={errors?.password}
              wrapperClassName="w-full"
              fieldClassName="w-full"
            />

            {/* BUTTON & NAVIGATION */}
            <div className="md:col-span-2 flex flex-col justify-center items-center gap-5">
              <button
                type="submit"
                disabled={isLoading}
                className="text-primary border border-primary px-5 py-3 rounded-full gap-2 hover:border-base-300 hover:text-base-300 transition-[color] duration-700 w-44"
              >
                Register
              </button>

              <div className="font-bold text-heading-main mb-10">
                <span>Already have an account? </span>{" "}
                <Link
                  href="/login"
                  className="link link-hover text-btn-primary"
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* <=================== VERIFICATION TAB ===================> */}
      {currentTab === "code" && <VerificationCode data={formData} />}
    </>
  );
}
