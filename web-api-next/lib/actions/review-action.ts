"use server";

import { listReviews, createReview } from "@/lib/api/reviews";
import { getTokenCookie } from "@/lib/cookies";

export const handleListReviews = async (productId: string) => {
  try {
    const result = await listReviews(productId);
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load reviews", data: [] };
  }
};

export const handleCreateReview = async (productId: string, rating: number, comment?: string) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true as const };
  }

  try {
    const result = await createReview(token, productId, rating, comment);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to submit review" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to submit review" };
  }
};
