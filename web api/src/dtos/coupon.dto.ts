import { z } from "zod";
import { CouponValidationSchema } from "../types/coupon.type";

export const CreateCouponDTO = CouponValidationSchema;
export type CreateCouponDTO = z.infer<typeof CreateCouponDTO>;

export const UpdateCouponDTO = CouponValidationSchema.partial();
export type UpdateCouponDTO = z.infer<typeof UpdateCouponDTO>;

export const ApplyCouponDTO = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().positive("Subtotal must be greater than 0")
});

export type ApplyCouponDTO = z.infer<typeof ApplyCouponDTO>;
