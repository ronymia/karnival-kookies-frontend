"use client";

import React from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import CustomToaster from "@/components/ui/toaster/CustomToaster";
import { errorHandler } from "@/helpers/errorHandler";
import {
  CustomForm,
  InputField,
  InputLabel,
  InputError,
  TextareaInputField,
} from "@/components/form";
import { Button } from "@/components/ui/buttons";
import { useCreateCampaign, useUpdateCampaign } from "../hooks";
import { campaignSchema, CAMPAIGN_TYPES, TRIGGER_TYPES } from "../schema";
import { FiCheck, FiTruck, FiGift, FiLayers, FiPercent } from "react-icons/fi";

function CampaignFormFields({ editData, onClose, isSubmitting }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const campaignType = watch("campaign_type") || "discount";
  const triggerType = watch("trigger_type") || "automatic";
  const discountType = watch("discount_type") || "percent";
  const isActive = watch("is_active") !== false;

  return (
    <div className="space-y-6">
      {/* CAMPAIGN TITLE */}
      <InputField
        name="title"
        label="Campaign Title"
        placeholder="e.g. Summer Cookie Splash 20% Off or Free Delivery Weekend"
        required
      />

      {/* DESCRIPTION */}
      <TextareaInputField
        name="description"
        label="Campaign Description"
        placeholder="Describe what customers get and any special terms..."
        rows={2}
      />

      {/* TRIGGER TYPE (AUTOMATIC VS COUPON CODE) */}
      <div className="flex flex-col gap-1.5 w-full">
        <InputLabel label="Campaign Activation Trigger" required />
        <div className="grid grid-cols-2 gap-2">
          {TRIGGER_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue("trigger_type", t.value, { shouldValidate: true })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                triggerType === t.value
                  ? "bg-primary/15 border-primary text-white shadow-sm ring-1 ring-primary/40"
                  : "bg-[#151312] border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
              }`}
            >
              <span className="font-semibold text-xs block text-primary">
                {t.value === "automatic" ? "⚡ Automatic" : "🏷️ Coupon Code"}
              </span>
              <span className="text-[11px] text-neutral-400 block mt-0.5 line-clamp-1">
                {t.value === "automatic" ? "Applied on cart subtotal" : "Customer enters promo code"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PROMO CODE (IF TRIGGER IS COUPON) */}
      {triggerType === "coupon" && (
        <InputField
          name="coupon_code"
          label="Coupon Promo Code"
          placeholder="e.g. SAVE20 or SWEETTREAT"
          helperText="Uppercase letters and numbers that customer enters in cart"
          required
        />
      )}

      {/* CAMPAIGN REWARD TYPE */}
      <div className="flex flex-col gap-1.5 w-full">
        <InputLabel label="Promotion Type & Reward" required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CAMPAIGN_TYPES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setValue("campaign_type", c.value, { shouldValidate: true })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                campaignType === c.value
                  ? "bg-primary/15 border-primary text-white shadow-sm ring-1 ring-primary/40"
                  : "bg-[#151312] border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
              }`}
            >
              <p className="font-medium text-xs text-white line-clamp-1">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* TYPE-SPECIFIC CONFIGURATION */}
      {campaignType === "discount" && (
        <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2">
            <FiPercent className="text-primary text-base" />
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Discount Rate
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 h-10">
            <button
              type="button"
              onClick={() => setValue("discount_type", "percent", { shouldValidate: true })}
              className={`rounded-lg border text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                discountType === "percent"
                  ? "bg-primary text-black border-primary font-bold"
                  : "bg-[#151312] border-white/10 text-neutral-300 hover:border-white/25"
              }`}
            >
              Percentage (%)
            </button>
            <button
              type="button"
              onClick={() => setValue("discount_type", "fixed", { shouldValidate: true })}
              className={`rounded-lg border text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
                discountType === "fixed"
                  ? "bg-primary text-black border-primary font-bold"
                  : "bg-[#151312] border-white/10 text-neutral-300 hover:border-white/25"
              }`}
            >
              Fixed Amount ($)
            </button>
          </div>

          <InputField
            name="discount_value"
            type="number"
            step="0.01"
            label={discountType === "percent" ? "Percentage Off (%)" : "Fixed Discount ($)"}
            placeholder={discountType === "percent" ? "e.g. 15" : "e.g. 5.00"}
            required
          />
        </div>
      )}

      {campaignType === "free_shipping" && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
          <FiTruck className="text-emerald-400 text-lg shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-emerald-400">Free Cold-Packed Delivery</p>
            <p className="text-neutral-300 mt-0.5">
              The standard delivery charge will automatically be waived ($0.00) whenever qualifying cart conditions are met.
            </p>
          </div>
        </div>
      )}

      {campaignType === "bogo_same" && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/25 space-y-3">
          <div className="flex items-center gap-2">
            <FiLayers className="text-blue-400 text-base" />
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              BOGO (Same Product)
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              name="buy_quantity"
              type="number"
              label="Customer Buys"
              placeholder="e.g. 2"
              required
            />
            <InputField
              name="free_quantity"
              type="number"
              label="Gets Free"
              placeholder="e.g. 1"
              required
            />
          </div>
        </div>
      )}

      {campaignType === "free_item" && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-3">
          <div className="flex items-center gap-2">
            <FiGift className="text-rose-400 text-base" />
            <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Free Gift Reward
            </h4>
          </div>
          <InputField
            name="free_quantity"
            type="number"
            label="Gift Quantity"
            placeholder="e.g. 1"
            required
          />
        </div>
      )}

      {/* MINIMUM CART SPEND */}
      <InputField
        name="minimum_spend"
        type="number"
        step="0.01"
        label="Minimum Cart Spend ($)"
        placeholder="0.00 (No minimum)"
        helperText="Required cart subtotal before this promotion activates"
      />

      {/* VALIDITY DATES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          name="start_date"
          type="date"
          label="Start Date (Optional)"
        />
        <InputField
          name="end_date"
          type="date"
          label="End Date (Optional)"
        />
      </div>

      {/* ACTIVE STATUS */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
        <div>
          <p className="font-semibold text-xs text-white">Campaign Status</p>
          <p className="text-[11px] text-neutral-400">
            {isActive ? "Currently Active and applying to orders" : "Paused / Disabled"}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => setValue("is_active", !isActive, { shouldValidate: true })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isActive ? "bg-emerald-500" : "bg-neutral-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* FORM ACTION BUTTONS */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          text="Cancel"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          variant="primary"
          text={editData ? "Update Campaign" : "Launch Campaign"}
          loading={isSubmitting}
        />
      </div>
    </div>
  );
}

CampaignFormFields.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default function CampaignForm({ editData = null, onClose }) {
  const [createCampaignMutation, { isLoading: isCreating }] = useCreateCampaign();
  const [updateCampaignMutation, { isLoading: isUpdating }] = useUpdateCampaign();

  const isSubmitting = isCreating || isUpdating;

  const defaultValues = {
    title: editData?.title || "",
    description: editData?.description || "",
    trigger_type: editData?.trigger_type || "automatic",
    coupon_code: editData?.coupon_code || "",
    campaign_type: editData?.campaign_type || "discount",
    discount_type: editData?.discount_type || "percent",
    discount_value: editData?.discount_value ?? 10,
    minimum_spend: editData?.minimum_spend ?? 0,
    buy_quantity: editData?.buy_quantity ?? 1,
    free_quantity: editData?.free_quantity ?? 1,
    start_date: editData?.start_date || "",
    end_date: editData?.end_date || "",
    is_active: editData?.is_active !== false,
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        coupon_code: values.trigger_type === "coupon" ? values.coupon_code.toUpperCase().trim() : "",
        discount_value: Number(values.discount_value || 0),
        minimum_spend: Number(values.minimum_spend || 0),
      };

      if (editData?.id) {
        await updateCampaignMutation({ id: editData.id, ...payload }).unwrap();
        toast.custom((t) => (
          <CustomToaster t={t} type="success" text="Campaign updated successfully!" />
        ));
      } else {
        await createCampaignMutation(payload).unwrap();
        toast.custom((t) => (
          <CustomToaster t={t} type="success" text="New campaign launched successfully!" />
        ));
      }
      onClose();
    } catch (err) {
      errorHandler({ err });
    }
  };

  return (
    <CustomForm
      schema={campaignSchema}
      defaultValues={defaultValues}
      submitHandler={handleSubmit}
      showFormActionButton={false}
    >
      <CampaignFormFields
        editData={editData}
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </CustomForm>
  );
}

CampaignForm.propTypes = {
  editData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
