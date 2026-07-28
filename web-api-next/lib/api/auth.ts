import apiClient from "./axios-instance";
import { API } from "./endpoints";
import { getErrorMessage } from "./error";
import type { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schema";

export type AuthUser = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
  role?: "user" | "admin";
  isActive?: boolean;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: AuthUser;
  };
};

export const register = async (data: RegisterFormData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(API.AUTH.REGISTER, data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Registration failed"));
  }
};

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(API.AUTH.LOGIN, data);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Login failed"));
  }
};

export const googleLogin = async (credential: string): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(API.AUTH.GOOGLE_LOGIN, { credential });
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Google login failed"));
  }
};
