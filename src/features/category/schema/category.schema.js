import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  description: z.string().optional().default(""),
});
