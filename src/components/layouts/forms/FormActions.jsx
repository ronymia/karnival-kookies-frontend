import ButtonSpinner from "@/components/ui/buttons/ButtonSpinner";

export default function FormActions({
  isLoading,
  onCancel,
  submitText = "Create",
  className,
}) {
  return (
    <div
      className={`w-full flex flex-col md:flex-row justify-center md:justify-end items-center gap-2 ${className}`}
    >
      {/* Cancel Button */}
      <button
        disabled={isLoading}
        onClick={onCancel}
        className="btn w-full md:btn-wide btn-outline btn-primary"
      >
        Cancel
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn w-full md:btn-wide btn-primary"
      >
        {isLoading ? <ButtonSpinner /> : submitText}
      </button>
    </div>
  );
}
