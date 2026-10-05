import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
      "Password must contain uppercase, lowercase, and a number"
    ),
  role: z.string().default("customer"),
});
