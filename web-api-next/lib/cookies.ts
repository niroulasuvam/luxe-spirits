"use server";

import { cookies } from "next/headers";
import type { AuthUser } from "./api/auth";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    ...cookieOptions,
  });
}

export async function setAdminTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin_auth_token",
    value: token,
    ...cookieOptions,
  });
}

export async function getTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export async function getAdminTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth_token")?.value;
}

export async function storeUserData(userData: AuthUser) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "user_data",
    value: JSON.stringify(userData),
    ...cookieOptions,
  });
}

export async function storeAdminUserData(userData: AuthUser) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "admin_user_data",
    value: JSON.stringify(userData),
    ...cookieOptions,
  });
}

export async function getUserData(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get("user_data")?.value;
  if (!userDataCookie) {
    return null;
  }

  try {
    return JSON.parse(userDataCookie) as AuthUser;
  } catch {
    return null;
  }
}

export async function getAdminUserData(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get("admin_user_data")?.value;
  if (!userDataCookie) {
    return null;
  }

  try {
    return JSON.parse(userDataCookie) as AuthUser;
  } catch {
    return null;
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
}

export async function clearAdminAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth_token");
  cookieStore.delete("admin_user_data");
}
