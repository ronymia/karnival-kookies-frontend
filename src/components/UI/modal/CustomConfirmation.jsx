import { createRoot } from "react-dom/client";

export default function CustomConfirmation({
  open,
  onConfirm,
  onCancel,
  onClose,
  showCancelButton = false,
  confirmButtonText,
  title,
  text,
  icon = "success",
  customClass = {
    modalContainer: "",
    title: "",
    text: "",
    confirmButton: "",
    cancelButton: "",
  },
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      className="w-screen h-screen fixed bg-black/50 bg-opacity-60 inset-0 z-[999] flex items-center justify-center overflow-hidden"
    >
      {/* Modal Content */}
      <div
        className={`bg-base-300 rounded-lg border w-96 md:w-[512px] border-error mx-auto text-center h-96 flex flex-col items-center justify-center ${customClass?.modalContainer}`}
      >
        {/* Trash Icon */}
        {/* */}
        {icon === "delete" && <DeleteIcon />}
        {icon === "success" && <SuccessIcon />}
        {/* Content */}
        <div className="mx-auto my-4 w-full">
          {/* Title */}
          <h3
            className={`text-lg font-black text-gray-800 ${customClass?.title}`}
          >
            {title}
          </h3>
          {/* tes=xt */}
          <p
            className={`text-sm text-gray-600 font-medium ${customClass?.text}`}
          >
            {text}
          </p>
        </div>
        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {/* Delete Button */}
          <button
            type="button"
            data-auto={`delete_confirmation_button`}
            onClick={async () => {
              await onConfirm?.();
              await onClose?.(); // Close modal after deletion
            }}
            className={`btn text-base-300 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 ${customClass?.confirmButton}`}
          >
            {confirmButtonText}
          </button>
          {/* Cancel Button */}
          {showCancelButton && (
            <button
              type="button"
              onClick={onClose}
              className={`btn btn-outline border-primary text-primary ${customClass?.cancelButton}`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Function to show the modal imperatively
CustomConfirmation.showConfirmation = ({
  onConfirm,
  onCancel,
  confirmButtonText = "Delete",
  showCancelButton = false,
  title,
  text,
  icon,
  customClass = {
    modalContainer: "",
    title: "",
    text: "",
    confirmButton: "",
    cancelButton: "",
  },
}) => {
  // Create a container for the modal
  const modalContainer = document.createElement("div");
  modalContainer.id = "delete-confirmation-modal";
  document.body.appendChild(modalContainer);

  // Render the modal using createRoot
  const root = createRoot(modalContainer);
  root.render(
    <CustomConfirmation
      open={true}
      onClose={() => {
        // Clean up the modal after closing
        root.unmount();
        document.body.removeChild(modalContainer);
      }}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmButtonText={confirmButtonText}
      showCancelButton={showCancelButton}
      title={title}
      text={text}
      icon={icon}
      customClass={customClass}
    />
  );
};

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="100"
    height="100"
    fill="green"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="green"
      stroke-width="1"
      fill="none"
    />
    <path
      d="M7 12l3 3 7-7"
      stroke="green"
      stroke-width="1"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="96"
    height="96"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-trash-2 mx-auto text-red-500"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
