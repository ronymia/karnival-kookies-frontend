import { z } from "zod";

/**
 * Zod validation schema for Combo Packages
 */
export const packageSchema = z
  .object({
    name: z
      .string({ required_error: "Package name is required" })
      .trim()
      .min(2, "Package name must be at least 2 characters")
      .max(150, "Package name cannot exceed 150 characters"),

    price: z.coerce
      .number({ invalid_type_error: "Price must be a valid number" })
      .positive("Price must be greater than 0"),

    quantity: z.coerce
      .number({ invalid_type_error: "Quantity must be a valid number" })
      .min(0, "Quantity cannot be negative")
      .default(10),

    unit: z
      .string({ required_error: "Unit of measurement is required" })
      .min(1, "Please select a unit"),

    is_discount_enable: z.coerce.number().default(0),

    discount_type: z.enum(["fixed", "percent"]).optional().nullable(),

    discount_value: z.coerce.number().optional().nullable(),

    description: z.string().optional().default(""),

    images: z
      .array(z.any())
      .min(1, "Please upload at least one package image"),

    status: z.enum(["active", "inactive"]).default("active"),
  })
  .superRefine((data, ctx) => {
    if (Number(data.is_discount_enable) === 1) {
      if (!data.discount_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_type"],
          message: "Please select a discount type",
        });
      }

      if (
        data.discount_value === undefined ||
        data.discount_value === null ||
        isNaN(data.discount_value) ||
        data.discount_value <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_value"],
          message: "Discount value must be greater than 0",
        });
      }

      if (data.discount_type === "percent" && data.discount_value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_value"],
          message: "Percentage discount cannot exceed 100%",
        });
      }

      if (data.discount_type === "fixed" && data.discount_value >= data.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discount_value"],
          message: "Fixed discount cannot exceed or equal the base price",
        });
      }
    }
  });
