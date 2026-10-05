"use client";

import { PackageForm } from "@/features/packages";
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
}) {
  const [popupOption, setPopupOption] = useState({
    open: false,
    closePopup: false,
    onClose: () => {
      setPopupOption({ ...popupOption, open: false });
    },
    overlayStyle: { background: "red" },
    closeOnDocumentClick: false,
  });

  const Form = () => {
    return (
      <>
        {form === "categoryForm" ? (
          <CategoryForm />
        ) : form === "packageForm" ? (
          <PackageForm />
        ) : (
          "Invalid Form Type"
        )}
      </>
    );
  };

  /* **************************************
  
  ***************************************************/
  return (
    <div>
      <>{children}</>

      {/* Popup */}
      <Popup
        open={popupOption?.open || open}
        onClose={popupOption.onClose}
        overlayStyle={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        }}
        closeOnDocumentClick={popupOption?.closeOnDocumentClick}
        className="relative overflow-hidden w-1/2 rounded-xl pop"
      >
        <div
          className={`relative  bg-secondary text-base-100 shadow-xl rounded-xl border-primary-content border-2 overflow-hidden w-[95vw] sm:w-[70vw] md:w-[70vw] lg:w-[50vw] ${popupClasses} max-h-[90vh] `}
        >
          {/* {!closeButtonHidden ? ( */}
          <button
            onClick={onClose}
            className="absolute z-[1000] top-3 right-3 w-9 h-9 rounded-full bg-base-300 flex justify-center items-center"
          >
            <FiX className="text-primary text-xl" />
          </button>
          {/* ) : (
          ""
        )} */}

          {title && (
            <div className="w-full px-8 py-5 text-body font-semibold text-2xl absolute top-0 z-[999] bg-primary text-base-300">
              {title}
            </div>
          )}

          <div className="px-5 mt-5 h-[84vh] overflow-y-auto overflow-x-hidden pt-14">
            {/* {Component} */}
            <Form />
          </div>
        </div>
      </Popup>
    </div>
  );
}
