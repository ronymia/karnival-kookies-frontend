import { z } from "zod";

export const CAMPAIGN_TYPES = [
  { value: "discount", label: "Price Discount (% or $)" },
  { value: "free_shipping", label: "Free Cold-Packed Delivery" },
  { value: "bogo_same", label: "BOGO (Same Product: Buy X, Get Y Free)" },
  { value: "bogo_different", label: "BOGO (Different: Buy A, Get B Free)" },
  { value: "free_item", label: "Free Gift Item (On Minimum Spend)" },
];

export const TRIGGER_TYPES = [
  { value: "automatic", label: "Automatic (Applied in Cart when conditions met)" },
  { value: "coupon", label: "Coupon Code (Customer enters promotional code)" },
];

export const campaignSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().optional().default(""),
  trigger_type: z.enum(["automatic", "coupon"]).default("automatic"),
  coupon_code: z.string().optional().default(""),
  campaign_type: z
    .enum([
      "discount",
      "free_shipping",
      "bogo_same",
      "bogo_different",
      "free_item",
    ])
    .default("discount"),
  discount_type: z.enum(["percent", "fixed"]).optional().default("percent"),
  discount_value: z.coerce.number().min(0).optional().default(0),
  minimum_spend: z.coerce.number().min(0, "Minimum spend cannot be negative").default(0),
  buy_product_id: z.string().optional().default(""),
  buy_quantity: z.coerce.number().min(1).optional().default(1),
  free_product_id: z.string().optional().default(""),
  free_quantity: z.coerce.number().min(1).optional().default(1),
  start_date: z.string().optional().default(""),
  end_date: z.string().optional().default(""),
  max_uses_total: z.coerce.number().min(0).optional().default(0),
  max_uses_per_customer: z.coerce.number().min(1).optional().default(1),
  is_active: z.boolean().default(true),
});
