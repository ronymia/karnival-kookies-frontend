import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string({ error: "Full name is required" })
    .trim()
    .min(1, "Full name is required"),
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email address is required"),
  phone: z.string().optional().or(z.literal("")),
  inquiryType: z.string().default("general"),
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(1, "Please write a message")
    .min(10, "Message should be at least 10 characters long"),
});
