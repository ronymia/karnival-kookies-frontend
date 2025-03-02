import ViewField from "@/components/UI/inputFields/ViewField";
import SplitDescription from "@/Shared/SplitDescription";
import { getDate } from "@/Utils/getDate";
import { htmlToPlainText } from "@/Utils/htmlToPlainText";

export default function PackageView({ data, handleClosePopup }) {
  return (
    <div className={`px-2 py-5 flex flex-col justify-between gap-10 h-[70vh]`}>
      <div className=" grid grid-cols-2 gap-5">
        {/* NAME */}
        <ViewField label={"Name"} value={data?.name} />

        {/* DISCOUNT TYPE */}
        {data?.is_discount_enable && (
          <ViewField label={"Discount Type"} value={data?.discount_type} />
        )}

        {/* DISCOUNT VALUE */}
        {data?.is_discount_enable && (
          <ViewField
            label={"Discount Value"}
            value={`${data?.discount_type === "percent" ? "" : "$"}${parseInt(
              data?.discount_value
            )}${data?.discount_type === "percent" ? "%" : ""}`}
          />
        )}

        {/* PRICE */}
        <ViewField
          label={"Price"}
          value={
            data?.is_discount_enable && data?.net_price
              ? `$${parseFloat(data?.net_price)?.toFixed(2)}`
              : `$${parseFloat(data?.price)?.toFixed(2)}`
          }
        />

        {/* QUANTITY */}
        <ViewField label={"Quantity"} value={data?.quantity} />

        {/* UNIT */}
        <ViewField label={"Unit"} value={data?.unit} />

        {/* CREATED */}
        <ViewField label={"Created At"} value={getDate(data?.created_at)} />

        {/* UPDATED */}
        <ViewField label={"Last Updated"} value={getDate(data?.updated_at)} />

        {/* DESCRIPTION */}
        <div className={`col-span-2`}>
          <ViewField
            label={"Description"}
            value={
              <SplitDescription
                text={htmlToPlainText(data?.description)}
                length={200}
              />
            }
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
        <button
          onClick={handleClosePopup}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
