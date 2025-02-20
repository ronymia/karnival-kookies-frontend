import Heading from "@/components/UI/Heading/Heading";
import InputField from "@/components/UI/inputFields/InputField";
import NumberField from "@/components/UI/inputFields/NumberField";
import TextareaField from "@/components/UI/inputFields/TextareaField";
import { formatRole } from "@/Utils/formatRole";

function CheckoutStep1({
  errors,
  setErrors,
  formData,
  dispatch,
  handleNextStep,
}) {
  // CHANGE FORM DATA
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    dispatch({
      type: "UPDATE_SHIPPING_INFO",
      payload: {
        field: name,
        value: value,
      },
    });
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
        <InputField
          value={formData?.shipping_info?.recipient_name}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.["recipient_name"]}
          id={"recipient_name"}
          label={formatRole("recipient_name")}
          name={"recipient_name"}
          onChange={handleFormChange}
          placeholder={formatRole("recipient_name")}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* EMAIL */}
        <InputField
          value={formData?.shipping_info?.email}
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
        <NumberField
          value={formData?.shipping_info?.phone}
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

        {/* ADDRESS */}
        <InputField
          value={formData?.shipping_info?.address}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.address}
          id={"address"}
          label={"Address"}
          name={"address"}
          onChange={handleFormChange}
          placeholder={"Address"}
          type={"text"}
          wrapperClassName={"w-full"}
          required={true}
        />
        {/* APARTMENT */}
        <InputField
          value={formData?.shipping_info?.apartment}
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
        {/* formData */}
        <InputField
          value={formData?.shipping_info?.state}
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
        <InputField
          value={formData?.shipping_info?.city}
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
        <InputField
          value={formData?.shipping_info?.country}
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
        <NumberField
          value={formData?.shipping_info?.postal_code}
          disable={false}
          fieldClassName={"w-full"}
          error={errors?.["postal_code"]}
          id={"postal_code"}
          label={"Zip/Postal code"}
          name={"postal_code"}
          onChange={handleFormChange}
          placeholder={"Zip/Postal code"}
          type={"text"}
          wrapperClassName={"w-full"}
        />
      </div>
      {/* DELIVERY INSTRUCTIONS */}
      <TextareaField
        value={formData?.shipping_info?.delivery_instruction}
        disable={false}
        fieldClassName={"w-full"}
        error={errors?.delivery_instruction}
        id={"delivery_instruction"}
        label={"Delivery Instructions"}
        name={"delivery_instruction"}
        onChange={handleFormChange}
        placeholder={"Delivery Instructions"}
        type={"text"}
        wrapperClassName={"w-full"}
      />

      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          type="button"
          disabled={false}
          onClick={() => handleNextStep?.()}
          className="btn w-full md:btn-wide btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CheckoutStep1;
