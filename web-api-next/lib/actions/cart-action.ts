"use server";

import { getCart, addCartItem, updateCartItem, removeCartItem, clearCart as clearCartApi, type CartData } from "@/lib/api/cart";
import { getTokenCookie } from "@/lib/cookies";

const EMPTY_CART: CartData = { items: [], itemCount: 0, subtotal: 0 };

type CartActionResult = { success: true; data: CartData } | { success: false; message?: string; authRequired?: boolean };

export const handleGetCart = async (): Promise<CartActionResult> => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: true, data: EMPTY_CART };
  }

  try {
    const result = await getCart(token);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to load cart" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load cart" };
  }
};

export const handleAddToCart = async (productId: string, quantity: number = 1): Promise<CartActionResult> => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true };
  }

  try {
    const result = await addCartItem(token, productId, quantity);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to add item to cart" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to add item to cart" };
  }
};

export const handleUpdateCartItem = async (productId: string, quantity: number): Promise<CartActionResult> => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true };
  }

  try {
    const result = await updateCartItem(token, productId, quantity);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to update cart" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update cart" };
  }
};

export const handleRemoveCartItem = async (productId: string): Promise<CartActionResult> => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true };
  }

  try {
    const result = await removeCartItem(token, productId);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to remove item" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to remove item" };
  }
};

export const handleClearCart = async (): Promise<CartActionResult> => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: true, data: EMPTY_CART };
  }

  try {
    const result = await clearCartApi(token);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to clear cart" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to clear cart" };
  }
};
