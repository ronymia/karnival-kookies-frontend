import ViewField from "@/components/ui/inputfields/ViewField";
import { usePopupContext } from "@/hooks/usePopupContext";
import moment from "moment";

function ViewUser() {
  const { popupOption } = usePopupContext();
  const data = popupOption?.data;

  return (
    <div
      data-auto={`container-viewUser`}
      className={`px-2 py-5 flex flex-col justify-between gap-10 h-[70vh]`}
    >
      <div className=" grid grid-cols-2 gap-5">
        {/* NAME */}
        <ViewField label={"Name"} value={data?.name} />

        {/* EMAIL */}
        <ViewField label={"Email"} value={data?.email} />

        {/* PHONE */}
        <ViewField label={"Phone"} value={data?.phone} />

        {/* ROLE */}
        <ViewField label={"Role"} value={data?.user_role} />

        {/* IS VERIFIED */}
        <ViewField
          label={"Is Verified"}
          value={data?.verified ? "Yes" : "No"}
        />

        {/* STATUS */}
        <ViewField label={"Status"} value={data?.status} />

        {/* ADDRESS */}
        <ViewField
          label={"Address"}
          value={`${data?.profile?.address} ${data?.profile?.city} ${data?.profile?.country}`}
        />

        {/* BIRTH DATE */}
        <ViewField
          label={"Date of Birth"}
          value={`${data?.profile?.date_of_birth}`}
        />
        {/* POSTCODE */}
        <ViewField label={"Postcode"} value={`${data?.profile?.postcode}`} />

        {/* GENDER */}
        <ViewField label={"Gender"} value={`${data?.profile?.gender}`} />

        {/* CREATE DATE */}
        <ViewField
          label={"Created At"}
          value={moment(data?.created_at).format("lll")}
        />

        {/* UPDATE DATE */}
        <ViewField
          label={"Updated At"}
          value={moment(data?.updated_at).format("lll")}
        />
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
        <button
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ViewUser;
