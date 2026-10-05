import { z } from "zod";

/**
 * Zod validation schema for Coupon Codes
 */
export const couponCodeSchema = z
  .object({
    code: z
      .string({ required_error: "Coupon code is required" })
      .trim()
      .min(2, "Coupon code must be at least 2 characters")
      .max(30, "Coupon code cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Code can only contain letters, numbers, hyphens, and underscores"
      ),

    discount_type: z.enum(["fixed", "percent"], {
      required_error: "Please select a discount type",
    }),

    discount_value: z.coerce
      .number({ invalid_type_error: "Discount value must be a valid number" })
      .positive("Discount value must be greater than 0"),

    minimum_spend: z.coerce
      .number({ invalid_type_error: "Minimum spend must be a number" })
      .min(0, "Minimum spend cannot be negative")
      .default(0),

    status: z.enum(["active", "inactive"]).default("active"),
  })
  .superRefine((data, ctx) => {
    if (data.discount_type === "percent" && data.discount_value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discount_value"],
        message: "Percentage discount cannot exceed 100%",
      });
    }
  });
