"use server";

import { revalidatePath } from "next/cache";
import { getWishlist, toggleWishlistProduct } from "@/lib/api/wishlist";
import { getTokenCookie } from "@/lib/cookies";

export const handleGetWishlist = async () => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: true, data: { products: [] } };
  }

  try {
    const result = await getWishlist(token);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to load wishlist" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load wishlist" };
  }
};

export const handleToggleWishlist = async (productId: string) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true as const };
  }

  try {
    const result = await toggleWishlistProduct(token, productId);
    if (result.success && result.data) {
      revalidatePath("/wishlist");
      revalidatePath("/dashboard");
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to update wishlist" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update wishlist" };
  }
};
