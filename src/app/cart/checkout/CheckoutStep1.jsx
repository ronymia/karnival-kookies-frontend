import Heading from "@/components/UI/Heading/Heading";
import InputField from "@/components/UI/inputFields/InputField";
import NumberField from "@/components/UI/inputFields/NumberField";
import TextareaField from "@/components/UI/inputFields/TextareaField";

const CheckoutStep1 = ({
  errors,
  setErrors,
  state,
  dispatch,
  validateForm,
  handleNextStep,
}) => {
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
          value={state?.shipping_info?.name}
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
        <InputField
          value={state?.shipping_info?.email}
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
          value={state?.shipping_info?.phone}
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
        <InputField
          value={state?.shipping_info?.streetAddress}
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
        <InputField
          value={state?.shipping_info?.apartment}
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
        <InputField
          value={state?.shipping_info?.state}
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
          value={state?.shipping_info?.city}
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
          value={state?.shipping_info?.country}
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
          value={state?.shipping_info?.postalCode}
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
      <TextareaField
        value={state?.shipping_info?.deliveryInstruction}
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
