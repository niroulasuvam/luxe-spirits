import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type Review = {
  _id: string;
  productId: string;
  userId: { _id: string; fullName?: string; profilePicture?: string } | string;
  rating: number;
  comment?: string;
  createdAt: string;
};

type ListResponse = { success: boolean; message?: string; data?: Review[] };
type DetailResponse = { success: boolean; message?: string; data?: Review };

export const listReviews = async (productId: string): Promise<ListResponse> => {
  try {
    const response = await apiClient.get<ListResponse>(API.REVIEWS.LIST(productId));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load reviews"));
  }
};

export const createReview = async (
  token: string,
  productId: string,
  rating: number,
  comment?: string
): Promise<DetailResponse> => {
  try {
    const response = await apiClient.post<DetailResponse>(
      API.REVIEWS.CREATE,
      { productId, rating, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to submit review"));
  }
};
