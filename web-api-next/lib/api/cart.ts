import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number;
  quantity: number;
};

export type CartData = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
};

export type CartResponse = {
  success: boolean;
  message?: string;
  data?: CartData;
};

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getCart = async (token: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.get<CartResponse>(API.CART.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load cart"));
  }
};

export const addCartItem = async (token: string, productId: string, quantity: number): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<CartResponse>(API.CART.ITEMS, { productId, quantity }, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to add item to cart"));
  }
};

export const updateCartItem = async (token: string, productId: string, quantity: number): Promise<CartResponse> => {
  try {
    const response = await apiClient.put<CartResponse>(API.CART.ITEM(productId), { quantity }, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update cart"));
  }
};

export const removeCartItem = async (token: string, productId: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.delete<CartResponse>(API.CART.ITEM(productId), authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to remove item from cart"));
  }
};

export const clearCart = async (token: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.delete<CartResponse>(API.CART.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to clear cart"));
  }
};
