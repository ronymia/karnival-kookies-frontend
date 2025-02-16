import { FiX } from "react-icons/fi";
import Popup from "reactjs-popup";

export default function CustomPopup({
  popupOption,
  setPopupOption,
  Component,
  popupClasses,
  closeButtonHidden = false,
}) {
  return (
    <Popup
      open={popupOption?.open}
      onClose={popupOption?.onClose}
      overlayStyle={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(2px)",
      }}
      closeOnDocumentClick={popupOption?.closeOnDocumentClick}
      lockScroll={true}
      // lockScroll={popupOption?.lockScroll || true}
      className="relative overflow-hidden w-1/2 rounded-xl pop"
    >
      <div
        className={`relative  bg-secondary text-base-100 shadow-xl rounded-xl border-primary-content border-2 overflow-hidden w-[95vw] sm:w-[70vw] md:w-[70vw] lg:w-[50vw] ${popupClasses} max-h-[90vh] `}
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
          <div className="sticky top-0 w-full px-8 py-5 text-body font-semibold text-2xl  z-[999] bg-primary text-base-300">
            {popupOption?.title}
          </div>
        )}

        {/* Content */}
        <div className="h-[84vh] overflow-y-auto overflow-x-hidden">
          {Component}
        </div>
      </div>
    </Popup>
  );
}
