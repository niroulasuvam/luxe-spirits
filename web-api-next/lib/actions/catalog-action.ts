"use server";

import { aiSearchProducts, listProducts, getProductBySlug, listCategories } from "@/lib/api/catalog";

export const handleListProducts = async (params: { category?: string; search?: string; maxPrice?: number } = {}) => {
  try {
    const result = await listProducts(params);
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load products", data: [] };
  }
};

export const handleGetProduct = async (slug: string) => {
  try {
    const result = await getProductBySlug(slug);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Product not found" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load product" };
  }
};

export const handleListCategories = async () => {
  try {
    const result = await listCategories();
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load categories", data: [] };
  }
};

export const handleAiSearchProducts = async (prompt: string) => {
  try {
    const result = await aiSearchProducts(prompt);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "AI search failed" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "AI search failed" };
  }
};
