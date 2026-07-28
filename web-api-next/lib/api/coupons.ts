import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type CouponApplyResult = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
};

type ApplyResponse = { success: boolean; message?: string; data?: CouponApplyResult };

export const applyCoupon = async (code: string, subtotal: number): Promise<ApplyResponse> => {
  try {
    const response = await apiClient.post<ApplyResponse>(API.COUPONS.APPLY, { code, subtotal });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to apply coupon"));
  }
};
