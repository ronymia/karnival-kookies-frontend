"use client";
import { jwt, login } from "@/apis/auth";
import { useAuthContext } from "@/Context/ProjectProvider";
import Code from "@/Shared/auth/Code";
import Button from "@/Shared/Button";
import CustomLoading from "@/Shared/CustomLoading";
import CustomToaster from "@/Shared/CustomToaster";
import CustomField from "@/Shared/Fields/CustomField";
import CustomPasswordField from "@/Shared/Fields/CustomPasswordField";
import { errorHandler } from "@/Utils/errorHandler";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("login");
  const { setUser, setIsUserComing } = useAuthContext();
  const [isLogging, setIsLogging] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // console.log({ formData });

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
    setIsLogging(true);
    login(formData)
      .then((res) => {
        if (!res?.data?.user?.isVerified) {
          setCurrentTab("code");
          setIsLogging(false);
          return;
        } else if (res?.success) {
          jwt({ email: res?.data?.user?.email })
            .then((token) => {
              console.log({ token });
              if (token?.success) {
                setIsUserComing(Math.random());
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
                // if (location?.state) {
                //   navigate(location?.state?.from);
                // } else {
                //   navigate("/");
                // }
                setIsLogging(false);
              }
            })
            .catch((err) => {
              setIsLogging(false);
            });
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
        errorHandler({ err, setLoading: setIsLogging });
        setIsLogging(false);
      });
  };

  //   SUBMIT DATA
  const handleSubmit = async () => {
    try {
      // Validate form
      const isValid = await validateForm();
      if (isValid) {
        createFunction(formData);
      }
    } catch (err) {}
  };

  /* **********************************************
  
  ***************************************************/
  if (isLogging) {
    return <CustomLoading />;
  } else {
    return (
      <>
        {currentTab === "login" && (
          <div className={` block overflow-auto pt-32 pb-60 space-y-10`}>
            <h2 className={`text-xl font-bold text-center`}>Login</h2>
            {/* LOGIN AREA */}
            <div className={`max-w-[360px] mx-auto flex flex-col gap-6`}>
              <h2 className={`text-xl font-bold`}>Welcome Back</h2>
              {/* EMAIL */}
              <CustomField
                defaultValue={formData?.email}
                disable={false}
                fieldClassName={"w-full"}
                error={errors?.email}
                id={"email"}
                name={"email"}
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
                placeholder={`Password`}
                name={`password`}
                error={errors?.password}
                wrapperClassName={`w-full`}
                fieldClassName={`w-full`}
              />
              {/* FORGOT PASSWORD */}
              <p
                onClick={() => router.push("/reset-password")}
                className={`text-right link link-hover text-btn-primary`}
              >
                Forgot password?
              </p>
              <div className={`flex justify-center items-center`}>
                <Button
                  text={"Login"}
                  handler={handleSubmit}
                  isLoading={isLogging}
                />
              </div>
              <div className={`font-bold text-heading-main pb-10`}>
                <span>First time here? </span>{" "}
                <span
                  onClick={() => router.push("/register")}
                  className={`link link-hover text-btn-primary`}
                >
                  Create account
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
