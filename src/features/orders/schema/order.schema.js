import { z } from "zod";

export const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

/**
 * Zod validation schema for updating order status.
 */
export const orderStatusSchema = z.object({
  status: z.enum(
    [
      "pending",
      "confirmed",
      "preparing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    {
      required_error: "Please select a valid order status",
    }
  ),
  note: z.string().optional().nullable(),
});
