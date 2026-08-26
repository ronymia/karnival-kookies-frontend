"use client";
import Button from "@/components/ui/buttons/Button";
import InputField from "@/components/ui/inputfields/InputField";
import PasswordField from "@/components/ui/inputfields/PasswordField";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import {
  useGetAccessTokenMutation,
  useResetPasswordMutation,
  useSendVerificationCodeMutation,
  useVerifyEmailCodeMutation,
} from "@/redux/apis/authApis";
import CustomNumberFieldForOtp from "@/shared/fields/CustomNumberFieldForOtp";
import { validationErrorHandler } from "@/utils/validationErrorHandler";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  /* COMPONENT TAB
   * reset_password
   * code
   * new_password
   */
  const [currentTab, setCurrentTab] = useState("reset_password");
  const [resetUserPassword, getUserByMailResult] =
    useSendVerificationCodeMutation();

  // FORM STATE
  const [formData, setFormData] = useState({
    email: "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   SUBMIT DATA
  const handleOnSubmit = (event) => {
    // PREVENT DEFAULT
    event.preventDefault();

    // VALIDATE FORM
    if (validateForm()) {
      resetUserPassword({ email: formData?.email })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            setCurrentTab("code");
          }
        })
        .catch((err) => {
          setErrors({
            email: err?.data?.message,
          });
        });
    }
  };

  return (
    <>
      {currentTab === "reset_password" && (
        <form
          noValidate
          onSubmit={handleOnSubmit}
          className={`max-w-md mx-auto flex flex-col gap-10 p-5 pt-32 pb-60 `}
        >
          <h2 className={`text-2xl font-bold capitalize text-center`}>
            Enter your email
          </h2>

          {/* EMAIL */}
          <InputField
            value={formData?.email}
            disable={false}
            fieldClassName={"w-full"}
            error={errors?.["email"]}
            id={"email"}
            name={"email"}
            onChange={handleFormChange}
            placeholder={"Email"}
            type={"email"}
            wrapperClassName={"w-full"}
            required={true}
          />

          {/* SUBMIT BUTTON */}
          <Button
            type={`submit`}
            text={"Submit"}
            isLoading={getUserByMailResult.isLoading}
            buttonClass={`mx-auto w-full md:w-1/2 flex items-center justify-center gap-2`}
          />
        </form>
      )}

      {/* <==================== RESET PASSWORD CODE ====================> */}
      {currentTab === "code" && (
        <ResetPasswordCode data={formData} setCurrentTab={setCurrentTab} />
      )}

      {/* <==================== SET NEW PASSWORD ====================> */}
      {currentTab === "new_password" && <NewPassword data={formData} />}
    </>
  );
}

function ResetPasswordCode({ data, setCurrentTab }) {
  const [verifyEmailCode, verifyEmailCodeResult] = useVerifyEmailCodeMutation();

  // VALIDATION
  const [errors, setErrors] = useState({});
  // OTP FORM STATE
  const [formData, setFormData] = useState({
    digit_1: "",
    digit_2: "",
    digit_3: "",
    digit_4: "",
  });

  const validateForm = () => {
    const newErrors = {};

    //   VALIDATE NAME
    if (
      !formData.digit_1 ||
      !formData.digit_2 ||
      !formData.digit_3 ||
      !formData.digit_4
    ) {
      newErrors.digit = "Please Provide Full OTP";
    }

    setErrors(newErrors);

    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // CHANGE FORM DATA
  const handleFormChange = (e, nextId, previousId) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const nextInput = document.querySelector(`#${nextId}`);
    const previousInput = document.querySelector(`#${previousId}`);

    if (value === "") {
      previousInput.focus(); // Move focus to the previous input
    } else {
      if (nextInput) {
        nextInput.focus(); // Programmatically focus the element
      }
    }
    if (
      formData?.digit_1 &&
      formData?.digit_2 &&
      formData?.digit_3 &&
      formData?.digit_4
    ) {
      setErrors({});
    }
  };

  //   SUBMIT DATA
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      createFunction(formData);
    }
  };

  const createFunction = async (formData) => {
    await verifyEmailCode({
      otp:
        formData?.digit_1 +
        formData?.digit_2 +
        formData?.digit_3 +
        formData?.digit_4,
      email: data?.email,
    })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          // CLEAR FORM
          setFormData({
            digit_1: "",
            digit_2: "",
            digit_3: "",
            digit_4: "",
          });

          // SET NEW PASSWORD TAB
          setCurrentTab("new_password");
        } else {
          setErrors({
            verifyError: res?.message,
          });
        }
      })
      .catch((err) => {
        setErrors({
          verifyError: err?.data?.message,
        });
      });
  };

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | CODE Verification";
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center gap-10 p-5 pt-32 pb-60`}
    >
      {/* <Image
        width={200}
        height={200}
        className={`w-40 mx-auto`}
        src="/storenetbdLogo.png"
        alt=""
      /> */}
      <header className={`space-y-2 text-center`}>
        <h2 className={`text-xl font-bold`}>Enter Verification Code</h2>
        <p className={`font-medium text-[14px]`}>
          We have Sent a Code to {data?.email}
        </p>
      </header>

      <form
        noValidate
        onSubmit={handleOnSubmit}
        className={`flex flex-col justify-center items-center gap-3`}
      >
        <div className={`flex gap-2`}>
          <CustomNumberFieldForOtp
            value={formData?.digit_1}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_1"}
            name={"digit_1"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_2}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_2"}
            name={"digit_2"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_3}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_3"}
            name={"digit_3"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
          <CustomNumberFieldForOtp
            value={formData?.digit_4}
            disable={false}
            fieldClassName={"w-12"}
            id={"digit_4"}
            name={"digit_4"}
            placeholder={""}
            onChange={handleFormChange}
            wrapperClassName={"w-12"}
            maxLength={1}
          />
        </div>

        {/* ERROR MESSAGE */}
        <label className="label ">
          <span className="label-text-alt text-error">
            {errors?.digit || errors?.verifyError}
          </span>
        </label>

        {/* SUBMIT BUTTON */}
        <div className={`flex justify-center items-center`}>
          <Button
            type={`submit`}
            text={"Submit"}
            isLoading={verifyEmailCodeResult.isLoading}
          />
        </div>
      </form>
    </div>
  );
}

function NewPassword({ data }) {
  const router = useRouter();
  const [resetPassword, passwordResetResult] = useResetPasswordMutation();
  const [getAccessToken, accessTokenResult] = useGetAccessTokenMutation();

  const [formData, setFormData] = useState({
    ...data,
    password: "",
    password_confirmation: "",
  });

  // VALIDATION
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

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

    if (!formData?.password || formData?.password.trim() === "") {
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
    if (formData?.password_confirmation !== formData?.password) {
      newErrors.password_confirmation = "Password does not match";
    }

    setErrors(newErrors);

    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   SUBMIT DATA
  const handleOnSubmit = async (event) => {
    // PREVENT DEFAULT
    event.preventDefault();
    if (validateForm()) {
      await resetPassword({
        email: formData?.email,
        password: formData?.password,
      })
        .unwrap()
        .then((res) => {
          console.log({ resFromXd: res });
          if (res?.success) {
            // GET ACCESS TOKEN
            getAccessToken({ email: formData?.email })
              .unwrap()
              .then((res) => {
                console.log({ res });
                if (res?.success) {
                  toast.custom((t) => (
                    <CustomToaster
                      t={t}
                      type={"success"}
                      text={`Password reset successfully`}
                    />
                  ));

                  // REDIRECT
                  router.push("/");
                }
              })
              .catch((err) => {
                console.log({ err });
              });
          } else {
            // REDIRECT
            router.push("/login");
          }
        })
        .catch((err) => {
          setErrors({
            password: err?.data?.message,
          });
        });
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleOnSubmit}
      className={`max-w-md mx-auto flex flex-col gap-10 p-5 pt-32 pb-60`}
    >
      <div className={`space-y-2 text-center`}>
        <h2 className={`text-xl font-bold`}>Reset your password</h2>
      </div>
      <div className={`space-y-2 flex flex-col justify-center items-center`}>
        {/* PASSWORD */}
        <PasswordField
          required={true}
          id="password"
          onChange={handleFormChange}
          value={formData?.password}
          label={`Password`}
          placeholder={`Password`}
          name={`password`}
          error={errors?.password}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
        {/* PASSWORD CONFIRMATION */}
        <PasswordField
          required={true}
          id="password_confirmation"
          onChange={handleFormChange}
          value={formData?.password_confirmation}
          label={`Confirm Password`}
          placeholder={`Password`}
          name={`password_confirmation`}
          error={errors?.password_confirmation}
          wrapperClassName={`w-full`}
          fieldClassName={`w-full`}
        />
      </div>

      {/* ACTION BUTTON */}
      <div className={`flex justify-center items-center`}>
        <Button
          type={`submit`}
          text={"Submit"}
          isLoading={
            passwordResetResult.isLoading || accessTokenResult.isLoading
          }
        />
      </div>
    </form>
  );
}
