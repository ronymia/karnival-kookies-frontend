import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name cannot exceed 100 characters"),
    price: z.coerce
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be greater than 0"),
    quantity: z.coerce
      .number({ invalid_type_error: "Quantity must be a number" })
      .min(0, "Quantity cannot be negative"),
    unit: z.enum(["kg", "litre", "pcs", "bag"], {
      invalid_type_error: "Please select a valid unit",
    }),
    is_discount_enable: z.coerce.number().default(0),
    discount_type: z.enum(["fixed", "percent"]).optional().nullable(),
    discount_value: z.coerce.number().optional().nullable(),
    category_id: z.coerce
      .number({ invalid_type_error: "Please select a category" })
      .positive("Category is required"),
    description: z.string().optional().default(""),
    images: z
      .array(z.any())
      .min(1, "At least one product image is required"),
    status: z.string().optional().default("active"),
  })
  .superRefine((data, ctx) => {
    if (data.is_discount_enable === 1) {
      if (!data.discount_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a discount type (Fixed or Percentage)",
          path: ["discount_type"],
        });
      }
      if (data.discount_value === undefined || data.discount_value === null || data.discount_value <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount value must be greater than 0",
          path: ["discount_value"],
        });
      } else if (data.discount_type === "fixed" && data.discount_value >= data.price) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fixed discount cannot be equal to or greater than the original price",
          path: ["discount_value"],
        });
      } else if (data.discount_type === "percent" && data.discount_value > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage discount cannot exceed 100%",
          path: ["discount_value"],
        });
      }
    }
  });
