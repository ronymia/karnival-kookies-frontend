"use client";

import React from "react";
import PropTypes from "prop-types";
import { CustomForm } from "@/components/form/CustomForm";
import { InputField, TextareaInputField } from "@/components/form/input";
import { Button } from "@/components/ui/buttons";
import { shippingInfoSchema } from "../../schema";
import { FiArrowRight, FiMapPin, FiTruck } from "react-icons/fi";

export default function CheckoutShippingStep({
  shippingInfo,
  onSaveShipping,
}) {
  const handleSubmit = (values) => {
    onSaveShipping(values);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
          <FiMapPin className="text-lg" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Shipping Destination
          </h2>
          <p className="text-xs text-neutral-400">
            Where should we send your fresh artisanal treats?
          </p>
        </div>
      </div>

      <CustomForm
        key={`${shippingInfo?.recipient_name || ""}-${shippingInfo?.email || ""}-${shippingInfo?.phone || ""}-${shippingInfo?.address || ""}`}
        schema={shippingInfoSchema}
        defaultValues={shippingInfo}
        submitHandler={handleSubmit}
        showFormActionButton={false}
        className="space-y-4"
      >
        {/* RECIPIENT NAME & PHONE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            name="recipient_name"
            label="Recipient Full Name"
            placeholder="e.g. Jane Doe"
            required
          />
          <InputField
            name="phone"
            label="Contact Phone"
            placeholder="e.g. +1 (555) 000-0000"
            required
          />
        </div>

        {/* EMAIL ADDRESS */}
        <InputField
          name="email"
          type="email"
          label="Email Address for Tracking"
          placeholder="e.g. jane.doe@example.com"
          required
          readOnly
          helperText="Linked to your verified account for delivery tracking"
          inputClassName="bg-white/[0.03] border-white/10 text-neutral-400 cursor-not-allowed select-none focus:ring-0 focus:border-white/10"
        />

        {/* STREET ADDRESS & APARTMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <InputField
              name="address"
              label="Street Address"
              placeholder="e.g. 123 Gourmet Way"
              required
            />
          </div>
          <InputField
            name="apartment"
            label="Apt / Suite (Optional)"
            placeholder="Apt 4B"
          />
        </div>

        {/* CITY, STATE, ZIP & COUNTRY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            name="city"
            label="City"
            placeholder="e.g. Seattle"
            required
          />
          <InputField
            name="state"
            label="State / Province"
            placeholder="e.g. WA"
            required
          />
          <InputField
            name="postal_code"
            label="Zip / Postal Code"
            placeholder="e.g. 98101"
            required
          />
          <InputField
            name="country"
            label="Country"
            placeholder="e.g. United States"
            required
          />
        </div>

        {/* SPECIAL INSTRUCTIONS */}
        <TextareaInputField
          name="delivery_instruction"
          label="Delivery Instructions (Optional)"
          placeholder="e.g. Leave at front porch, gate code #1234, ring doorbell..."
          rows={3}
        />

        {/* CARRIER NOTICE */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-neutral-400">
          <FiTruck className="text-primary text-base shrink-0" />
          <span>
            Fulfilled via priority refrigerated delivery to preserve maximum freshness and crunch.
          </span>
        </div>

        {/* ACTIONS */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            text="Continue to Order Summary"
            endIcon={FiArrowRight}
            className="w-full sm:w-auto px-8 shadow-lg shadow-primary/20"
          />
        </div>
      </CustomForm>
    </div>
  );
}

CheckoutShippingStep.propTypes = {
  shippingInfo: PropTypes.object.isRequired,
  onSaveShipping: PropTypes.func.isRequired,
};
