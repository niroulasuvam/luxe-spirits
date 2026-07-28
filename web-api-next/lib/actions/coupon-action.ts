"use server";

import { applyCoupon } from "@/lib/api/coupons";

export const handleApplyCoupon = async (code: string, subtotal: number) => {
  try {
    const result = await applyCoupon(code, subtotal);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Invalid coupon code" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to apply coupon" };
  }
};
