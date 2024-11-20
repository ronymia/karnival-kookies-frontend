import CustomField from "@/Shared/Fields/CustomField";
import CustomNumberField from "@/Shared/Fields/CustomNumberField";
import CustomTextareaField from "@/Shared/Fields/CustomTextAreaField";
import Heading from "@/Shared/Heading";
import React from "react";

const CheckoutStep1 = ({
  errors,
  setErrors,
  formData,
  setFormData,
  validateForm,
  handleNextStep,
}) => {
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      step1: { ...prev?.step1, [name]: value },
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <div className={`w-full `}>
      <Heading isSubHeading={false} heading={"Shipping Information"} />
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5`}>
        {/* NAME */}
        <CustomField
          value={formData?.step1?.name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.name}
          id={"name"}
          label={"Name"}
          name={"name"}
          onChange={handleFormChange}
          placeholder={"Name"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* EMAIL */}
        <CustomField
          value={formData?.step1?.email}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.email}
          id={"email"}
          label={"Email"}
          name={"email"}
          onChange={handleFormChange}
          placeholder={"Email"}
          type={"email"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* PHONE */}
        <CustomNumberField
          value={formData?.step1?.phone}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.phone}
          id={"phone"}
          label={"Phone"}
          name={"phone"}
          onChange={handleFormChange}
          placeholder={"Phone"}
          wrapperClassName={"w-full"}
          required={true}
        />

        {/* STREET ADDRESS */}
        <CustomField
          value={formData?.step1?.streetAddress}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.streetAddress}
          id={"streetAddress"}
          label={"Street"}
          name={"streetAddress"}
          onChange={handleFormChange}
          placeholder={"Street"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* APARTMENT */}
        <CustomField
          value={formData?.step1?.apartment}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.apartment}
          id={"apartment"}
          label={"Apartment Info"}
          name={"apartment"}
          onChange={handleFormChange}
          placeholder={"Apartment Info"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
        {/* STATE */}
        <CustomField
          value={formData?.step1?.state}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.state}
          id={"state"}
          label={"State"}
          name={"state"}
          onChange={handleFormChange}
          placeholder={"State"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* CITY */}
        <CustomField
          value={formData?.step1?.city}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.city}
          id={"city"}
          label={"City"}
          name={"city"}
          onChange={handleFormChange}
          placeholder={"City"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* COUNTRY */}
        <CustomField
          value={formData?.step1?.country}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.country}
          id={"country"}
          label={"Country"}
          name={"country"}
          onChange={handleFormChange}
          placeholder={"Country"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* ZIP */}
        <CustomNumberField
          value={formData?.step1?.postalCode}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.postalCode}
          id={"postalCode"}
          label={"Zip/Postal code"}
          name={"postalCode"}
          onChange={handleFormChange}
          placeholder={"Zip/Postal code"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </div>
      {/* DELIVERY INSTRUCTIONS */}
      <CustomTextareaField
        defaultValue={formData?.step1?.deliveryInstruction}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.deliveryInstruction}
        id={"deliveryInstruction"}
        label={"Additional Instructions"}
        name={"deliveryInstruction"}
        onChange={handleFormChange}
        placeholder={"Additional Instructions"}
        type={"text"}
        wrapperClassName={"w-full"}
      />
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={false}
          onClick={() => handleNextStep(validateForm)}
          className="btn w-full md:btn-wide btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep1;
