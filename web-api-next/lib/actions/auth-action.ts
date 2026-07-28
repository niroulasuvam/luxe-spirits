"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { googleLogin, register, login } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schema";
import { clearAdminAuthCookies, clearAuthCookies, setAdminTokenCookie, setTokenCookie, storeAdminUserData, storeUserData } from "@/lib/cookies";

export const handleRegisterUser = async (data: RegisterFormData) => {
  try {
    const result = await register(data);
    if (result.success) {
      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || "Registration failed" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Registration failed" };
  }
};

export const handleLoginUser = async (data: LoginFormData) => {
  try {
    const result = await login(data);

    if (result.success) {
      if (!result.data?.token || !result.data.user) {
        return { success: false, message: "Login response is missing authentication data" };
      }

      await setTokenCookie(result.data.token);
      await storeUserData(result.data.user);
      revalidatePath("/", "layout");

      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Login failed" };
  }
};

export const handleLoginAdmin = async (data: LoginFormData) => {
  try {
    const result = await login(data);

    if (result.success) {
      if (!result.data?.token || !result.data.user) {
        return { success: false, message: "Login response is missing authentication data" };
      }
      if (result.data.user.role !== "admin") {
        return { success: false, message: "This account does not have admin access" };
      }

      await setAdminTokenCookie(result.data.token);
      await storeAdminUserData(result.data.user);
      revalidatePath("/admin", "layout");

      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || "Login failed" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Login failed" };
  }
};

export const handleGoogleLoginUser = async (credential: string) => {
  try {
    const result = await googleLogin(credential);
    if (result.success) {
      if (!result.data?.token || !result.data.user) {
        return { success: false, message: "Google login response is missing authentication data" };
      }

      await setTokenCookie(result.data.token);
      await storeUserData(result.data.user);
      revalidatePath("/", "layout");
      return { success: true, message: result.message, data: result.data };
    }
    return { success: false, message: result.message || "Google login failed" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Google login failed" };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  revalidatePath("/", "layout");
  return { success: true };
};

export const handleAdminLogout = async () => {
  await clearAdminAuthCookies();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
};
