"use client";
import { createUser } from "@/apis/auth";
import Code from "@/Shared/auth/Code";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import CustomField from "@/Shared/Fields/CustomField";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import CustomPasswordField from "@/Shared/Fields/CustomPasswordField";
import Heading from "@/Shared/Heading";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [currentTab, setCurrentTab] = useState("register");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  console.log({ formData });

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE NAME
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    //   VALIDATE EMAIL
    if (!formData?.email || formData?.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData?.email?.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    //   VALIDATE PASSWORD
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password) {
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(formData?.password)) {
        newErrors.password =
          "Password should have at least one uppercase, lowercase and number";
      }
      if (formData?.password?.length < 8) {
        newErrors.password = "Password should have at least 8 character";
      }
    }

    setErrors(newErrors);

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

  //   SUBMIT DATA
  const handleSubmit = async () => {
    if (validateForm()) {
      createFunction(formData);
    }
  };

  const [isCreatingId, setIsCreatingId] = useState(false);
  const createFunction = async () => {
    setIsCreatingId(true);
    createUser(formData)
      .then((res) => {
        if (res?.error) {
          setIsCreatingId(false);
          return toast.custom((t) => (
            <CustomToaster t={t} type={"error"} text={res?.error} />
          ));
        }
        if (res?.success) {
          console.log({ user: res });
          setCurrentTab("code");
          setIsCreatingId(false);
        }
        if (!res?.success) {
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          toast.custom((t) => (
            <CustomToaster
              t={t}
              type={"error"}
              text={"Something went wrong. Please register again"}
            />
          ));
          setIsCreatingId(false);
        }
        setIsCreatingId(false);
      })
      .catch((err) => {
        setIsCreatingId(false);
      });
  };
  if (isCreatingId) {
    return <CustomLoading />;
  } else {
    return (
      <>
        {currentTab === "register" && (
          <div className={` block overflow-auto pt-32 pb-60 space-y-10`}>
            <Heading heading={"Create An Account"} isSubHeading={false} />
            {/* LOGIN AREA */}
            <div className={`max-w-[360px] mx-auto flex flex-col gap-6`}>
              <h2 className={`text-lg font-bold`}>
                Lets get your account set up
              </h2>
              <div>
                {/* NAME */}
                <CustomField
                  defaultValue={formData?.name}
                  disable={false}
                  fieldClassName={"w-full"}
                  error={errors?.name}
                  id={"name"}
                  name={"name"}
                  label={"Name"}
                  onChange={handleFormChange}
                  placeholder={"Name"}
                  type={"text"}
                  wrapperClassName={"w-full"}
                  required={true}
                />
                {/* PHONE */}
                <CustomNumberField
                  defaultValue={formData?.phone}
                  disable={false}
                  fieldClassName={"w-full"}
                  error={errors?.phone}
                  id={"phone"}
                  label={"Phone"}
                  name={"phone"}
                  onChange={handleFormChange}
                  placeholder={"Phone"}
                  wrapperClassName={"w-full"}
                />
                {/* EMAIL */}
                <CustomField
                  defaultValue={formData?.email}
                  disable={false}
                  fieldClassName={"w-full"}
                  error={errors?.email}
                  id={"email"}
                  name={"email"}
                  label={"Email"}
                  onChange={handleFormChange}
                  placeholder={"Email"}
                  type={"email"}
                  wrapperClassName={"w-full"}
                  required={true}
                />
                {/* PASSWORD */}
                <CustomPasswordField
                  required={true}
                  id="password"
                  onChange={handleFormChange}
                  value={formData?.password}
                  label={"Password"}
                  placeholder={`Password`}
                  name={`password`}
                  error={errors?.password}
                  wrapperClassName={`w-full`}
                  fieldClassName={`w-full`}
                />
              </div>
              <div className={`flex justify-center items-center`}>
                <Button
                  text={"Register"}
                  handler={handleSubmit}
                  isLoading={isCreatingId}
                />
              </div>

              <div className={`font-bold text-heading-main mb-10`}>
                <span>Already have an account? </span>{" "}
                <span
                  onClick={() => router.push("/login")}
                  className={`link link-hover text-btn-primary`}
                >
                  Login
                </span>
              </div>
            </div>
          </div>
        )}
        {currentTab === "code" && <Code data={formData} />}
      </>
    );
  }
};

export default Page;
