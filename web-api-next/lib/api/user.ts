import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";
import type { AuthUser } from "./auth";

export type ProfileResponse = {
  success: boolean;
  message?: string;
  data?: AuthUser;
};

export const getProfile = async (token: string): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get<ProfileResponse>(API.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to load profile"));
  }
};

export const updateProfile = async (token: string, formData: FormData): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.put<ProfileResponse>(API.AUTH.PROFILE, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update profile"));
  }
};

export const changePassword = async (
  token: string,
  payload: { currentPassword: string; newPassword: string }
): Promise<SimpleResponse> => {
  try {
    const response = await apiClient.put<SimpleResponse>(API.AUTH.CHANGE_PASSWORD, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to change password"));
  }
};

export type SimpleResponse = {
  success: boolean;
  message?: string;
};

export const forgotPassword = async (email: string): Promise<SimpleResponse> => {
  try {
    const response = await apiClient.post<SimpleResponse>(API.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to request password reset"));
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<SimpleResponse> => {
  try {
    const response = await apiClient.post<SimpleResponse>(API.AUTH.RESET_PASSWORD, { token, newPassword });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to reset password"));
  }
};

export const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string): Promise<SimpleResponse> => {
  try {
    const response = await apiClient.post<SimpleResponse>(API.AUTH.RESET_PASSWORD_OTP, { email, otp, newPassword });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to reset password"));
  }
};
