import Heading from "@/components/ui/heading/Heading";
import ViewField from "@/components/ui/inputfields/ViewField";
import { useSelector } from "react-redux";

const CheckoutStep3 = ({ formData, handleNextStep, handlePrevStep }) => {
  const { totalPrice: checkoutAmount } = useSelector((state) => state.cart);

  /* ============================================
  
  ==================================================*/
  return (
    <div className={`space-y-5`}>
      <Heading isSubHeading={false} heading={"Order Information"} />
      <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`}>
        {/* RECIPIENT NAME */}
        <ViewField
          label={"Recipient Name"}
          value={formData?.shipping_info?.recipient_name}
        />

        {/* EMAIL */}
        <ViewField label={"Email"} value={formData?.shipping_info?.email} />

        {/* PHONE */}
        <ViewField label={"Phone"} value={formData?.shipping_info?.phone} />

        {/* ADDRESS */}
        <ViewField label={"Address"} value={formData?.shipping_info?.address} />

        {/* APARTMENT */}
        <ViewField
          label={"Apartment"}
          value={formData?.shipping_info?.apartment}
        />

        {/* CITY */}
        <ViewField label={"City"} value={formData?.shipping_info?.city} />

        {/* STATE */}
        <ViewField label={"formData"} value={formData?.shipping_info?.state} />

        {/* COUNTRY */}
        <ViewField label={"Country"} value={formData?.shipping_info?.country} />

        {/* ZIP */}
        {formData?.shipping_info?.postal_code && (
          <ViewField
            label={"Zip/Postal Code"}
            value={formData?.shipping_info?.postal_code}
          />
        )}

        {/* PAYMENT AMOUNT */}
        <ViewField
          label={"Payment Amount"}
          value={`$${checkoutAmount?.toFixed(2)}`}
        />
      </div>

      {/* DELIVERY INSTRUCTION */}
      {formData?.shipping_info?.delivery_instruction && (
        <ViewField
          label={"Delivery Instruction"}
          value={formData?.shipping_info?.delivery_instruction}
        />
      )}

      {/* BUTTON */}
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center py-5 gap-2">
        <button
          disabled={false}
          onClick={handlePrevStep}
          className="btn w-full md:btn-wide btn-primary"
        >
          Previous
        </button>
        <button
          disabled={false}
          onClick={() => handleNextStep(true)}
          className="btn w-full md:btn-wide btn-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CheckoutStep3;
