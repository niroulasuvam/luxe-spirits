import { z } from "zod";

export const CouponValidationSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .transform((value) => value.toUpperCase()),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().default(true)
});

export type CouponDataType = z.infer<typeof CouponValidationSchema>;
