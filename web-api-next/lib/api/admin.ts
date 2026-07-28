import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";
import type { Order } from "./orders";
import type { Product } from "./catalog";

export type AdminUser = {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt?: string;
};

type ListResponse<T> = { success: boolean; message?: string; data?: T[] };
type DetailResponse<T> = { success: boolean; message?: string; data?: T };

const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const listAdminUsers = async (token: string): Promise<ListResponse<AdminUser>> => {
  try {
    const response = await apiClient.get<ListResponse<AdminUser>>(API.ADMIN.USERS, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load users"));
  }
};

export const updateAdminUser = async (
  token: string,
  id: string,
  payload: Partial<Pick<AdminUser, "fullName" | "role" | "isActive">>
): Promise<DetailResponse<AdminUser>> => {
  try {
    const response = await apiClient.put<DetailResponse<AdminUser>>(API.ADMIN.USER(id), payload, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update user"));
  }
};

export const deleteAdminUser = async (token: string, id: string): Promise<DetailResponse<null>> => {
  try {
    const response = await apiClient.delete<DetailResponse<null>>(API.ADMIN.USER(id), authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to delete user"));
  }
};

export const listAdminOrders = async (token: string): Promise<ListResponse<Order & { userId?: AdminUser }>> => {
  try {
    const response = await apiClient.get<ListResponse<Order & { userId?: AdminUser }>>(API.ADMIN.ORDERS, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load orders"));
  }
};

export const updateAdminOrderStatus = async (token: string, id: string, status: string, estimatedHours?: number) => {
  try {
    const payload = estimatedHours && estimatedHours > 0 ? { status, estimatedHours } : { status };
    const response = await apiClient.put(`/api/v1/orders/admin/${id}/status`, payload, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update order"));
  }
};

export const createAdminProduct = async (token: string, formData: FormData) => {
  try {
    const response = await apiClient.post(API.PRODUCTS.LIST, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to create product"));
  }
};

export const updateAdminProduct = async (token: string, id: string, formData: FormData) => {
  try {
    const response = await apiClient.put(`/api/v1/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update product"));
  }
};

export const deleteAdminProduct = async (token: string, id: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/products/${id}`, authHeaders(token));
    return response.data as DetailResponse<null>;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to delete product"));
  }
};

export const sendPasswordRecovery = async (token: string, id: string): Promise<DetailResponse<null>> => {
  try {
    const response = await apiClient.post<DetailResponse<null>>(API.ADMIN.USER_RECOVERY(id), null, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to send recovery"));
  }
};

export const notifyAdminUsers = async (token: string, formData: FormData): Promise<DetailResponse<{ sent: number }>> => {
  try {
    const response = await apiClient.post<DetailResponse<{ sent: number }>>(API.ADMIN.NOTIFY, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to send notification"));
  }
};

export type AdminProduct = Product;
