"use server";

import { createOrder, getOrder, listOrders, type CreateOrderPayload } from "@/lib/api/orders";
import { getTokenCookie } from "@/lib/cookies";

export const handleListOrders = async () => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true as const, data: [] };
  }

  try {
    const result = await listOrders(token);
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load orders", data: [] };
  }
};

export const handleCreateOrder = async (payload: CreateOrderPayload) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true as const };
  }

  try {
    const result = await createOrder(token, payload);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to place order" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to place order" };
  }
};

export const handleGetOrder = async (orderNumber: string) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, authRequired: true as const };
  }

  try {
    const result = await getOrder(token, orderNumber);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Order not found" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load order" };
  }
};
