import { z } from "zod";

/**
 * Zod validation schema for SEO Page Meta Data
 */
export const metaDataSchema = z.object({
  meta_key: z
    .string({ required_error: "Please select a target page" })
    .min(1, "Page key is required"),

  title: z
    .string({ required_error: "SEO Page Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),

  description: z
    .string({ required_error: "Meta description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),
});
