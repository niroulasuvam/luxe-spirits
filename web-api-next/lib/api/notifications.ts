import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";

export type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  image?: string;
  href?: string;
  read: boolean;
  createdAt: string;
};

type NotificationListResponse = { success: boolean; message?: string; data?: NotificationItem[] };
const authHeaders = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export const listNotifications = async (token: string): Promise<NotificationListResponse> => {
  try {
    const response = await apiClient.get<NotificationListResponse>(API.NOTIFICATIONS.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load notifications"));
  }
};

export const markNotificationsRead = async (token: string): Promise<NotificationListResponse> => {
  try {
    const response = await apiClient.put<NotificationListResponse>(API.NOTIFICATIONS.READ_ALL, null, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to mark notifications read"));
  }
};

export const clearNotifications = async (token: string): Promise<NotificationListResponse> => {
  try {
    const response = await apiClient.delete<NotificationListResponse>(API.NOTIFICATIONS.BASE, authHeaders(token));
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to clear notifications"));
  }
};
