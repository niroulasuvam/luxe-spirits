"use client";

import { useActionState } from "react";
import { handleCreateProduct } from "@/lib/actions/admin-action";
import type { Brand, Category } from "@/lib/api/catalog";

export function ProductForm({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const [state, formAction, isPending] = useActionState(handleCreateProduct, { success: false, message: "" });
  const defaultBrand = brands[0]?._id || "";

  return (
    <form action={formAction} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold">Add Liquor</h2>
        <p className="mt-1 text-sm text-neutral-500">Fill the basics. The rest can be edited later.</p>
        {categories.length === 0 && (
          <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            No categories found. Restart the backend so default categories like Vodka are created.
          </p>
        )}
        {state.message && (
          <p className={`mt-3 rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Liquor Name</span>
          <input name="name" required placeholder="e.g. Sakura Gin" className="h-12 w-full rounded-lg border border-neutral-200 px-4" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Category</span>
          <select name="categoryId" required className="h-12 w-full rounded-lg border border-neutral-200 px-4">
            <option value="">Choose category</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Original Price</span>
          <input name="price" required type="number" min="1" step="0.01" placeholder="Normal NRP price before discount" className="h-12 w-full rounded-lg border border-neutral-200 px-4" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold">Discount Percent</span>
          <input name="discountPercent" type="number" min="0" max="95" step="1" placeholder="30, 40, etc." className="h-12 w-full rounded-lg border border-neutral-200 px-4" />
        </label>
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm font-bold">Alcohol / ABV</span>
          <input name="abv" required placeholder="e.g. 40%" defaultValue="40%" className="h-12 w-full rounded-lg border border-neutral-200 px-4" />
        </label>
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm font-bold">Picture</span>
          <input name="image" required type="file" accept="image/*" className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3" />
        </label>
        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm font-bold">Short Description</span>
          <textarea name="description" required placeholder="What should customers know about this liquor?" rows={3} className="w-full rounded-lg border border-neutral-200 px-4 py-3" />
        </label>
      </div>

      <details className="mt-6 rounded-lg border border-neutral-200 p-4">
        <summary className="cursor-pointer text-sm font-bold text-[#806505]">Optional details</summary>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <select name="brandId" defaultValue={defaultBrand} className="h-11 rounded-lg border border-neutral-200 px-4">
            {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
          </select>
          <input name="origin" placeholder="Origin" defaultValue="Nepal" className="h-11 rounded-lg border border-neutral-200 px-4" />
          <input name="age" placeholder="Age" defaultValue="New Release" className="h-11 rounded-lg border border-neutral-200 px-4" />
          <input name="badge" placeholder="Badge" className="h-11 rounded-lg border border-neutral-200 px-4" />
          <input name="notes" placeholder="Notes, comma separated" className="h-11 rounded-lg border border-neutral-200 px-4" />
        </div>
      </details>

      <button disabled={isPending} className="mt-6 h-12 w-full rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] disabled:opacity-60">
        {isPending ? "Adding..." : "Add liquor"}
      </button>
    </form>
  );
}
