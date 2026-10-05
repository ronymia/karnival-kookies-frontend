import { z } from "zod";

export const resetPasswordEmailSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
