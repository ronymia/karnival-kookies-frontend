import { z } from "zod";

/**
 * Zod validation schema for User Accounts
 */
export const userSchema = z.object({
  name: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email is required"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(7, "Please enter a valid phone number"),

  role: z
    .string({ required_error: "Please assign a user role" })
    .min(1, "Role is required"),

  gender: z.enum(["male", "female", "other"]).optional().nullable(),

  date_of_birth: z.string().optional().nullable(),

  address: z.string().optional().nullable(),

  city: z.string().optional().nullable(),

  country: z.string().optional().nullable(),

  postcode: z.string().optional().nullable(),

  password: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        return (
          val.length >= 8 &&
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /\d/.test(val)
        );
      },
      {
        message:
          "Password must be at least 8 characters and contain uppercase, lowercase, and numbers",
      }
    ),
});
