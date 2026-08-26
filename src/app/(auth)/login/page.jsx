"use client";
import VerificationCode from "@/components/layouts/authentication/VerificationCode";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";
import InputField from "@/components/ui/inputfields/InputField";
import PasswordField from "@/components/ui/inputfields/PasswordField";
import CustomLoading from "@/components/ui/loader/CustomLoading";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import { useLoginUserMutation } from "@/redux/apis/authApis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowRoundForward } from "react-icons/io";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  // TAB
  const [currentTab, setCurrentTab] = useState("login");

  // LOGIN ERROR STATE
  const [errors, setErrors] = useState({});
  // USER LOGIN
  const [login, loginResult] = useLoginUserMutation();

  // FORM STATE
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // VALIDATION
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

  const createFunction = async () => {
    await login(formData)
      .unwrap()
      .then((res) => {
        // IF USER EMAIL UNVERIFIED
        if (!res?.data?.user?.is_email_verified) {
          setCurrentTab("code");
          return;
        } else if (res?.success) {
          setFormData({
            email: "",
            password: "",
          });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Successfully",
            showConfirmButton: false,
            timer: 1500,
          });
          router.push("/");
        }
      })
      .catch((err) => {
        console.log({ first: err });
        const obj = {};

        if (err?.status === 401) {
          err?.data?.errorSources?.forEach((item) => {
            obj["password"] = item?.message;
          });

          setErrors(obj);
        }
        errorHandler({ err });
      });
  };

  //   SUBMIT DATA
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    // Validate form
    const isValid = validateForm();
    if (isValid) {
      await createFunction(formData);
    }
  };

  // Set Page Title in Client Component
  useEffect(() => {
    document.title = "Karnival Cookies | Login";
  }, []);

  /* **********************************************
  
  ***************************************************/
  if (loginResult.isLoading) {
    return <CustomLoading />;
  } else {
    return (
      <>
        {/* <------------------------------------------ LOGIN ------------------------------------------> */}
        {currentTab === "login" && (
          <div className={` block overflow-auto pt-32 pb-60 space-y-10`}>
            <h2 className={`text-xl font-bold text-center`}>Login</h2>
            {/* LOGIN AREA */}
            <form
              noValidate
              onSubmit={handleOnSubmit}
              className={`max-w-[360px] mx-auto flex flex-col gap-6`}
            >
              <h2 className={`text-xl font-bold`}>Welcome Back</h2>
              {/* EMAIL */}
              <InputField
                value={formData?.email}
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
              <PasswordField
                required={true}
                id="password"
                onChange={handleFormChange}
                value={formData?.password}
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
                label={`Password`}
              />
              {/* FORGOT PASSWORD */}
              <p
                onClick={() => router.push("/reset-password")}
                className={`text-right link link-hover text-btn-primary`}
              >
                Forgot password?
              </p>

              {/* <------------------------------------------ SUBMIT BUTTON ------------------------------------------> */}
              <div className={`flex justify-center items-center group`}>
                <button
                  type={`submit`}
                  className={`text-primary border border-primary px-5 py-3 rounded-full flex items-center gap-2 group-hover:border-base-300 transition-[border]`}
                >
                  {loginResult.isLoading ? (
                    <ButtonSpinner />
                  ) : (
                    <>
                      <p className="group-hover:text-base-300 transition-[color] duration-700">
                        {`Login`}
                      </p>
                      {
                        <IoIosArrowRoundForward className="group-hover:text-base-300 group-hover:translate-x-2  transition-transform duration-300" />
                      }
                    </>
                  )}
                </button>
              </div>

              {/* <------------------------------------------ CREATE ACCOUNT ------------------------------------------> */}
              <div className={`font-bold text-heading-main pb-10`}>
                <span>First time here? </span>{" "}
                <span
                  onClick={() => router.push("/register")}
                  className={`link link-hover text-btn-primary`}
                >
                  Create account
                </span>
              </div>
            </form>
          </div>
        )}

        {/* <------------------------------------------ EMAIL VERIFICATION CODE ------------------------------------------> */}
        {currentTab === "code" && <VerificationCode data={formData} />}
      </>
    );
  }
}
