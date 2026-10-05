import React from "react";
import PropTypes from "prop-types";

export default function CampaignStatusToggle({ isActive, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
        isActive ? "bg-emerald-500" : "bg-neutral-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          isActive ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

CampaignStatusToggle.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
