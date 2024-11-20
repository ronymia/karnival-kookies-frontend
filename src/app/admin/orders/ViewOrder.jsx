"use client";
import { usePopupContext } from "@/Context/ProjectProvider";
import Tabs from "@/Shared/Tabs";
import { useState } from "react";
import ShippingComponent from "./ShippingComponent";
import AdditionalInfoComponent from "./AdditionalInfoComponent";
import ProductComponent from "./ProductComponent";

const ViewOrder = () => {
  const { popupOption } = usePopupContext();
  const tabs = [
    {
      id: 1,
      name: "Shipping",
    },
    {
      id: 2,
      name: "Product",
    },
    {
      id: 3,
      name: "Additional Info",
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  console.log({ activeTab });
  return (
    <div className={`px-2 py-5 flex flex-col justify-between gap-10 h-[70vh]`}>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        {activeTab === 1 && <ShippingComponent />}
        {activeTab === 2 && <ProductComponent />}
        {activeTab === 3 && <AdditionalInfoComponent />}
      </div>
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2 pb-5">
        <button
          onClick={popupOption?.onClose}
          className="btn w-full md:btn-wide btn-outline btn-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ViewOrder;
