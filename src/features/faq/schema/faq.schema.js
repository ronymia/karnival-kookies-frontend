import { z } from "zod";

/**
 * Zod validation schema for FAQ Items
 */
export const faqSchema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(250, "Question cannot exceed 250 characters"),

  answer: z
    .string({ required_error: "Answer is required" })
    .trim()
    .min(5, "Answer must be at least 5 characters"),
});
