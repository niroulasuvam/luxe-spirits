"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminProduct, deleteAdminProduct, deleteAdminUser, listAdminOrders, listAdminUsers, notifyAdminUsers, sendPasswordRecovery, updateAdminOrderStatus, updateAdminProduct, updateAdminUser } from "@/lib/api/admin";
import { listBrands, listCategories, listProducts } from "@/lib/api/catalog";
import { getAdminTokenCookie, getAdminUserData } from "@/lib/cookies";

async function requireAdminToken() {
  const [token, user] = await Promise.all([getAdminTokenCookie(), getAdminUserData()]);
  if (!token || user?.role !== "admin") {
    redirect("/admin/login");
  }
  return token;
}

function applyDiscountToFormData(formData: FormData) {
  const originalPrice = Number(formData.get("price"));
  const discountPercent = Number(formData.get("discountPercent"));
  formData.delete("discountPercent");

  if (Number.isFinite(originalPrice) && Number.isFinite(discountPercent) && discountPercent > 0) {
    const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    formData.set("oldPrice", String(originalPrice));
    formData.set("price", String(discountedPrice));
    return;
  }

  formData.delete("oldPrice");
}

export const handleAdminUsers = async () => {
  const token = await requireAdminToken();
  try {
    const result = await listAdminUsers(token);
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load users", data: [] };
  }
};

export const handleAdminOrders = async () => {
  const token = await requireAdminToken();
  try {
    const result = await listAdminOrders(token);
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load orders", data: [] };
  }
};

export const handleAdminCatalogOptions = async () => {
  await requireAdminToken();
  const [categoriesResult, brandsResult] = await Promise.all([listCategories(), listBrands()]);
  return {
    categories: categoriesResult.data || [],
    brands: brandsResult.data || [],
  };
};

export const handleAdminProducts = async () => {
  await requireAdminToken();
  try {
    const result = await listProducts();
    return { success: true, data: result.data || [] };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to load liquors", data: [] };
  }
};

export const handleToggleUserActive = async (id: string, isActive: boolean) => {
  const token = await requireAdminToken();
  await updateAdminUser(token, id, { isActive });
  revalidatePath("/admin/users");
};

export const handleChangeUserRole = async (id: string, role: "user" | "admin") => {
  const token = await requireAdminToken();
  await updateAdminUser(token, id, { role });
  revalidatePath("/admin/users");
};

export const handleDeleteUser = async (id: string) => {
  const token = await requireAdminToken();
  await deleteAdminUser(token, id);
  revalidatePath("/admin/users");
};

export const handleSendPasswordRecovery = async (id: string) => {
  const token = await requireAdminToken();
  await sendPasswordRecovery(token, id);
  revalidatePath("/admin/users");
};

export const handleCreateProduct = async (_prevState: { message: string; success: boolean }, formData: FormData) => {
  const token = await requireAdminToken();
  try {
    const name = String(formData.get("name") || "");
    if (!formData.get("slug")) {
      formData.set("slug", `${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`);
    }
    applyDiscountToFormData(formData);
    const notes = String(formData.get("notes") || "")
      .split(",")
      .map((note) => note.trim())
      .filter(Boolean);
    formData.delete("notes");
    for (const note of notes) {
      formData.append("notes", note);
    }
    await createAdminProduct(token, formData);
    revalidatePath("/admin/liquors");
    revalidatePath("/dashboard");
    return { success: true, message: "Liquor added successfully" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to add liquor" };
  }
};

export const handleUpdateProduct = async (id: string, _prevState: { message: string; success: boolean }, formData: FormData) => {
  const token = await requireAdminToken();
  try {
    const notes = String(formData.get("notes") || "")
      .split(",")
      .map((note) => note.trim())
      .filter(Boolean);
    formData.delete("notes");
    for (const note of notes) {
      formData.append("notes", note);
    }
    applyDiscountToFormData(formData);
    const image = formData.get("image");
    if (image instanceof File && image.size === 0) {
      formData.delete("image");
    }
    await updateAdminProduct(token, id, formData);
    revalidatePath("/admin/liquors");
    revalidatePath("/dashboard");
    return { success: true, message: "Liquor updated" };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to update liquor" };
  }
};

export const handleDeleteProduct = async (id: string) => {
  const token = await requireAdminToken();
  await deleteAdminProduct(token, id);
  revalidatePath("/admin/liquors");
  revalidatePath("/dashboard");
};

export const handleUpdateOrderStatus = async (id: string, status: string, formData?: FormData) => {
  const token = await requireAdminToken();
  const estimatedHoursValue = formData?.get("estimatedHours");
  const estimatedHours = Number(estimatedHoursValue);
  await updateAdminOrderStatus(token, id, status, Number.isFinite(estimatedHours) && estimatedHours > 0 ? estimatedHours : undefined);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
};

export const handleNotifyUsers = async (_prevState: { message: string; success: boolean }, formData: FormData) => {
  const token = await requireAdminToken();
  try {
    const image = formData.get("image");
    if (image instanceof File && image.size === 0) {
      formData.delete("image");
    }
    const result = await notifyAdminUsers(token, formData);
    return { success: true, message: `Notification sent to ${result.data?.sent || 0} users` };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : "Failed to send notification" };
  }
};
