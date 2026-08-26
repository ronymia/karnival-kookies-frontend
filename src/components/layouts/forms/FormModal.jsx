"use client";

import ProductForm from "@/app/admin/all-products/ProductForm";
import CategoryForm from "@/app/admin/categories/CategoryForm";
import CouponForm from "@/app/admin/coupon-codes/CouponForm";
import PackageForm from "@/app/admin/packages/PackageForm";
import PackageView from "@/app/admin/packages/PackageView";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import Popup from "reactjs-popup";

export default function FormModal({
  children,
  form,
  type,
  data,
  handleClose,
  popupClasses,
  open,
  title,
  onClose,
  handleCreate,
}) {
  const [popupOption, setPopupOption] = useState({
    open: open || false,
    closePopup: false,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });
  console.log("second");

  const FormComponent = () => {
    switch (type) {
      case "create":
        switch (form) {
          case "categoryForm":
            return <CategoryForm />;
          case "packageForm":
            return <PackageForm />;
          case "productForm":
            return <ProductForm />;
          case "couponForm":
            return <CouponForm />;
          default:
            return "Invalid Form Type";
        }

      case "delete":
        return <div />; // Common delete modal for all forms

      case "view":
        switch (form) {
          case "categoryForm":
            return <div />;
          case "packageForm":
            return <PackageView />;
          case "productForm":
            return <PackageView />;
          default:
            return "Invalid Form Type";
        }

      default:
        return "Invalid Type";
    }
  };

  /* **************************************
  
  ***************************************************/
  return (
    <>
      {type === "create" && <Button text={"Add"} handler={handleCreate} />}

      {/* MODAL */}
      <Popup
        open={popupOption?.open}
        onClose={popupOption?.onClose}
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        }}
        closeOnDocumentClick={popupOption?.closeOnDocumentClick}
        lockScroll={true}
        className="relative overflow-hidden w-1/2 rounded-xl pop"
      >
        <div
          className={`relative bg-secondary text-base-100 shadow-xl rounded-xl border-primary-content border-2 w-[95vw] sm:w-[70vw] md:w-[70vw] lg:w-[50vw] ${popupClasses} max-h-[90vh] flex flex-col`}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setPopupOption({
                ...popupOption,
                open: false,
              });
            }}
            className="absolute z-[1000] top-3 right-3 w-9 h-9 rounded-full bg-base-300 flex justify-center items-center"
          >
            <FiX className="text-primary text-xl" />
          </button>

          {/* Title */}
          {popupOption?.title && (
            <div className="sticky top-0 w-full px-8 py-5 text-body font-semibold text-2xl z-[999] bg-primary text-base-300">
              {popupOption?.title}
            </div>
          )}

          {/* Content with Scrolling */}
          <div className="flex-1 overflow-y-auto p-3">{FormComponent()}</div>
        </div>
      </Popup>
    </>
  );
}
