"use server";

import { clearNotifications, listNotifications, markNotificationsRead } from "@/lib/api/notifications";
import { getTokenCookie } from "@/lib/cookies";

export const handleListNotifications = async () => {
  const token = await getTokenCookie();
  if (!token) return { success: true, data: [] };
  try {
    const result = await listNotifications(token);
    return { success: true, data: result.data || [] };
  } catch {
    return { success: false, data: [] };
  }
};

export const handleMarkNotificationsRead = async () => {
  const token = await getTokenCookie();
  if (!token) return { success: true, data: [] };
  const result = await markNotificationsRead(token);
  return { success: true, data: result.data || [] };
};

export const handleClearNotifications = async () => {
  const token = await getTokenCookie();
  if (!token) return { success: true, data: [] };
  await clearNotifications(token);
  return { success: true, data: [] };
};
