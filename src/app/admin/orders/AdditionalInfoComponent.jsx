import ViewField from "@/components/ui/inputfields/ViewField";
import { usePopupContext } from "@/hooks/usePopupContext";
import { formatRole } from "@/utils/formatRole";
import { getDate, getTime } from "@/utils/getDate";

const AdditionalInfoComponent = () => {
  const { popupOption } = usePopupContext();
  console.log({ popupOption });
  const checkoutInfo = popupOption?.data;
  return (
    <div className=" grid grid-cols-2 gap-5">
      <div className={`col-span-2`}>
        <ViewField label={"Order Id"} value={checkoutInfo?.orderId} />
      </div>
      <ViewField
        label={"paymentMethod"}
        value={formatRole(checkoutInfo?.paymentMethod)}
      />
      <ViewField label={"Status"} value={formatRole(checkoutInfo?.status)} />

      <div className={`col-span-2`}>
        <ViewField label={"User Email"} value={checkoutInfo?.userEmail} />
      </div>
      <ViewField
        label={"Total Amount"}
        value={checkoutInfo?.totalPayableAmount}
      />
      <ViewField
        label={"Created Date"}
        value={getDate(popupOption?.data?.createdAt)}
      />
      <ViewField
        label={"Created Time"}
        value={getTime(popupOption?.data?.createdAt)}
      />
      <ViewField
        label={"Last Updated Date"}
        value={getDate(popupOption?.data?.updatedAt)}
      />
      <ViewField
        label={"Last Updated Time"}
        value={getTime(popupOption?.data?.updatedAt)}
      />
    </div>
  );
};

export default AdditionalInfoComponent;
