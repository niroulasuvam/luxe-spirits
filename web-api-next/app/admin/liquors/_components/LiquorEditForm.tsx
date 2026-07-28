"use client";

import { useActionState } from "react";
import { SafeImage } from "@/app/_components/SafeImage";
import { handleDeleteProduct, handleUpdateProduct } from "@/lib/actions/admin-action";
import type { Brand, Category, Product } from "@/lib/api/catalog";
import { formatNpr } from "@/lib/format";

export function LiquorEditForm({ product, categories, brands }: { product: Product; categories: Category[]; brands: Brand[] }) {
  const [state, formAction, isPending] = useActionState(handleUpdateProduct.bind(null, product._id), { success: false, message: "" });
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : "";
  const originalPrice = product.oldPrice && product.oldPrice > product.price ? product.oldPrice : product.price;

  return (
    <details className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5">
      <summary className="cursor-pointer list-none">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-neutral-100">
            <SafeImage src={product.image} alt={product.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-neutral-500">{product.categoryId.name} • {product.abv} alcohol</p>
            <p className="mt-1 font-semibold text-[#806505]">
              {formatNpr(product.price)}
              {discountPercent ? <span className="ml-2 text-xs text-green-700">{discountPercent}% off</span> : null}
            </p>
          </div>
          <span className="rounded-lg bg-[#d8b52f] px-5 py-2 text-sm font-bold text-[#3c3106]">Edit</span>
        </div>
      </summary>
      {state.message && <p className={`mt-3 text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
      <form action={formAction} className="mt-6 grid gap-5 md:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-bold">Liquor Name</span>
          <input name="name" defaultValue={product.name} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Slug</span>
          <input name="slug" defaultValue={product.slug} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Category</span>
          <select name="categoryId" defaultValue={product.categoryId._id} className="h-11 w-full rounded border border-neutral-200 px-3">
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Brand</span>
          <select name="brandId" defaultValue={product.brandId._id} className="h-11 w-full rounded border border-neutral-200 px-3">
            {brands.map((brand) => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Original Price</span>
          <input name="price" type="number" defaultValue={originalPrice} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Discount Percent</span>
          <input name="discountPercent" type="number" min="0" max="95" defaultValue={discountPercent} placeholder="30, 40, etc." className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Origin</span>
          <input name="origin" defaultValue={product.origin} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Age</span>
          <input name="age" defaultValue={product.age} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Alcohol / ABV</span>
          <input name="abv" defaultValue={product.abv} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold">Badge</span>
          <input name="badge" defaultValue={product.badge || ""} placeholder="Offer, Rare, Vintage" className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-bold">Tasting Notes</span>
          <input name="notes" defaultValue={product.notes.join(", ")} className="h-11 w-full rounded border border-neutral-200 px-3" />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-bold">Replace Picture</span>
          <input name="image" type="file" accept="image/*" className="w-full rounded border border-neutral-200 p-3" />
        </label>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm font-bold">Description</span>
          <textarea name="description" defaultValue={product.description} rows={3} className="w-full rounded border border-neutral-200 p-3" />
        </label>
        <button disabled={isPending} className="h-11 rounded bg-[#d8b52f] font-semibold text-[#3c3106]">{isPending ? "Saving..." : "Save Changes"}</button>
      </form>
      <form action={handleDeleteProduct.bind(null, product._id)} className="mt-3">
        <button className="h-10 rounded border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50">Delete Liquor</button>
      </form>
    </details>
  );
}
