"use server";

import { revalidatePath } from "next/cache";
import { changePassword, getProfile, updateProfile, forgotPassword, resetPassword, resetPasswordWithOtp } from "@/lib/api/user";
import { getTokenCookie, storeUserData } from "@/lib/cookies";
import type { AuthUser } from "@/lib/api/auth";

export const handleGetProfile = async () => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await getProfile(token);
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    return { success: false, message: result.message || "Failed to load profile" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load profile" };
  }
};

export const handleUpdateProfile = async (formData: FormData) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await updateProfile(token, formData);
    if (result.success && result.data) {
      await storeUserData(result.data);
      revalidatePath("/", "layout");
      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || "Failed to update profile" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update profile" };
  }
};

export type ProfileFormState = { success: boolean; message?: string; data?: AuthUser } | null;

export const updateProfileFormAction = async (
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> => {
  return handleUpdateProfile(formData);
};

export const handleForgotPassword = async (email: string) => {
  try {
    const result = await forgotPassword(email);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to request password reset" };
  }
};

export const handleResetPassword = async (token: string, newPassword: string) => {
  try {
    const result = await resetPassword(token, newPassword);
    return { success: result.success, message: result.message };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to reset password" };
  }
};

export const handleResetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
  try {
    const result = await resetPasswordWithOtp(email, otp, newPassword);
    return { success: result.success, message: result.message || "Password changed successfully" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to reset password" };
  }
};

export const handleChangePassword = async (_prevState: { success: boolean; message: string }, formData: FormData) => {
  const token = await getTokenCookie();
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match" };
  }

  try {
    const result = await changePassword(token, { currentPassword, newPassword });
    return { success: result.success, message: result.message || "Password changed successfully" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to change password" };
  }
};
