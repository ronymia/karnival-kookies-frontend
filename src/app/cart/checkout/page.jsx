"use client";
import { validationErrorHandler } from "@/Utils/validationErrorHandler";
import { useEffect, useState } from "react";
import CheckoutStep2 from "./CheckoutStep2";
import CheckoutStep3 from "./CheckoutStep3";
import PaymentStep4 from "./PaymentStep4";
import useCheckoutReducer from "./checkoutReducer";
import { useSelector } from "react-redux";
import CustomMultiStepper from "@/Shared/steppers/CustomMultiStepper";
import CheckoutStep1 from "./CheckoutStep1";

function CheckOutPage() {
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);

  const { state: formData, dispatch } = useCheckoutReducer();

  // console.log({ formData });

  // SET USER
  useEffect(() => {
    ["email"].forEach((field) => {
      dispatch({
        type: "UPDATE_SHIPPING_INFO",
        payload: {
          field: field,
          value: user?.email,
        },
      });
    });
  }, []);

  const validateForm1 = () => {
    const newErrors = {};

    // VALIDATE NAME
    if (
      !formData.shipping_info.recipient_name ||
      formData.shipping_info.recipient_name.trim() === ""
    ) {
      newErrors.recipient_name = "Recipient Name is required";
    }

    // VALIDATE EMAIL
    if (
      !formData?.shipping_info?.email ||
      formData?.shipping_info?.email.trim() === ""
    ) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
        formData?.shipping_info?.email?.trim()
      )
    ) {
      newErrors.email = "Invalid email";
    }

    // VALIDATE PHONE
    if (!formData.shipping_info.phone) {
      newErrors.phone = "Phone is required";
    }

    // VALIDATE STREET
    if (
      !formData.shipping_info.address ||
      formData.shipping_info.address.trim() === ""
    ) {
      newErrors.address = "Address is required";
    }

    // VALIDATE APARTMENT
    if (
      !formData.shipping_info.apartment ||
      formData.shipping_info.apartment.trim() === ""
    ) {
      newErrors.apartment = "Apartment is required";
    }

    // VALIDATE CITY
    if (
      !formData.shipping_info.city ||
      formData.shipping_info.city.trim() === ""
    ) {
      newErrors.city = "City is required";
    }

    // VALIDATE state
    if (
      !formData.shipping_info.state ||
      formData.shipping_info.state.trim() === ""
    ) {
      newErrors.state = "State is required";
    }

    // VALIDATE COUNTRY
    if (
      !formData.shipping_info.country ||
      formData.shipping_info.country.trim() === ""
    ) {
      newErrors.country = "Country is required";
    }

    // VALIDATE postal_code
    if (
      !formData.shipping_info.postal_code ||
      formData.shipping_info.postal_code.trim() === ""
    ) {
      newErrors.postal_code = "Postal Code is required";
    }

    setErrors1(newErrors);
    // console.log({ newErrors });
    validationErrorHandler(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      if (validateForm1()) {
        setStep((prev) => prev + 1);
      }
    } else if (step === 2 || step === 3) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  // VALIDATION
  const [errors1, setErrors1] = useState({});

  return (
    <>
      <div
        className={`max-w-screen-xl mx-auto px-5 md:px-10 flex flex-col justify-center items-center gap-10 pt-32 mb-60 w-full `}
      >
        <div className=" mb-5 w-full md:w-1/2 ">
          <CustomMultiStepper
            steps={[
              {
                serial: 1,
                id: 1,
                title: "Shipping Information",
              },
              {
                serial: 2,
                id: 2,
                title: "Payment Information",
              },
              {
                serial: 3,
                id: 3,
                title: "Order Review",
              },
              {
                serial: 4,
                id: 4,
                title: "Confirm Payment",
              },
            ]}
            currentStep={step}
          />
        </div>
        <div className={`w-full`}>
          {step === 1 && (
            <CheckoutStep1
              errors={errors1}
              setErrors={setErrors1}
              handleNextStep={handleNextStep}
              formData={formData}
              dispatch={dispatch}
            />
          )}
          {step === 2 && (
            <CheckoutStep2
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              formData={formData}
              dispatch={dispatch}
            />
          )}
          {step === 3 && (
            <CheckoutStep3
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              formData={formData}
            />
          )}
          {step === 4 && (
            <PaymentStep4
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              formData={formData}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default CheckOutPage;
