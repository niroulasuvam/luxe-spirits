import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type WishlistProduct = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  badge?: string;
};

export type WishlistData = {
  products: WishlistProduct[];
  added?: boolean;
};

type WishlistResponse = { success: boolean; message?: string; data?: WishlistData };

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const getWishlist = async (token: string): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.get<WishlistResponse>(API.WISHLIST.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load wishlist"));
  }
};

export const toggleWishlistProduct = async (token: string, productId: string): Promise<WishlistResponse> => {
  try {
    const response = await apiClient.post<WishlistResponse>(API.WISHLIST.TOGGLE, { productId }, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update wishlist"));
  }
};
