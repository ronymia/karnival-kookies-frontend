import ViewField from "@/components/UI/inputFields/ViewField";
import { usePopupContext } from "@/Context/ProjectProvider";
import SplitDescription from "@/Shared/SplitDescription";

const ShippingComponent = () => {
  const { popupOption } = usePopupContext();
  const { checkoutInfo } = popupOption?.data;
  return (
    <div className=" grid grid-cols-2 gap-5">
      <ViewField label={"Name"} value={checkoutInfo?.name} />
      <ViewField label={"Phone"} value={checkoutInfo?.phone} />
      <div className={`col-span-2`}>
        <ViewField label={"Email"} value={checkoutInfo?.email} />
      </div>
      <div className={`col-span-2`}>
        <ViewField label={"State"} value={checkoutInfo?.state} />
      </div>
      <ViewField label={"Street"} value={checkoutInfo?.streetAddress} />
      <ViewField label={"Zip/Postcode"} value={checkoutInfo?.postalCode} />
      <ViewField label={"City"} value={checkoutInfo?.city} />
      <ViewField label={"Country"} value={checkoutInfo?.country} />
      <ViewField label={"Apartment No"} value={checkoutInfo?.apartment} />
      <div className={`col-span-2`}>
        <ViewField
          label={"Delivery Instructions"}
          value={
            <SplitDescription
              text={checkoutInfo?.deliveryInstruction}
              length={200}
            />
          }
        />
      </div>
    </div>
  );
};

export default ShippingComponent;
