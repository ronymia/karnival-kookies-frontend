import { z } from "zod";

/**
 * Zod validation schema for Checkout Shipping Information
 */
export const shippingInfoSchema = z.object({
  recipient_name: z
    .string({ required_error: "Recipient name is required" })
    .trim()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name cannot exceed 100 characters"),

  email: z
    .string({ required_error: "Email address is required" })
    .trim()
    .email("Please enter a valid email address"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(7, "Please enter a valid phone number"),

  address: z
    .string({ required_error: "Street address is required" })
    .trim()
    .min(3, "Street address must be at least 3 characters"),

  apartment: z.string().optional().nullable(),

  city: z
    .string({ required_error: "City is required" })
    .trim()
    .min(2, "City must be at least 2 characters"),

  state: z
    .string({ required_error: "State is required" })
    .trim()
    .min(2, "State is required"),

  country: z
    .string({ required_error: "Country is required" })
    .trim()
    .min(2, "Country is required"),

  postal_code: z
    .string({ required_error: "Postal code is required" })
    .trim()
    .min(2, "Postal code is required"),

  delivery_instruction: z.string().optional().nullable(),
});
