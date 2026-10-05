"use client";

import PropTypes from "prop-types";
import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";

export default function FormActionButton({
  isLoading = false,
  cancelHandler,
  className = "",
  label = "Submit",
  cancelLabel = "Cancel",
  submitButtonClass = "",
  cancelButtonClass = "",
}) {
  return (
    <div className={`mt-6 flex items-center gap-3 ${className}`}>
      <button
        type="submit"
        disabled={isLoading}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-primary text-black hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 transition-all cursor-pointer ${submitButtonClass}`}
      >
        {isLoading ? (
          <>
            <ButtonSpinner />
            <span>Processing...</span>
          </>
        ) : (
          label
        )}
      </button>

      {cancelHandler && (
        <button
          type="button"
          disabled={isLoading}
          onClick={cancelHandler}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-full font-semibold text-sm bg-transparent hover:bg-white/10 text-white/90 hover:text-white border border-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer ${cancelButtonClass}`}
        >
          {cancelLabel}
        </button>
      )}
    </div>
  );
}

FormActionButton.propTypes = {
  isLoading: PropTypes.bool,
  cancelHandler: PropTypes.func,
  className: PropTypes.string,
  label: PropTypes.string,
  cancelLabel: PropTypes.string,
  submitButtonClass: PropTypes.string,
  cancelButtonClass: PropTypes.string,
};
