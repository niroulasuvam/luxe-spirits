"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/api/catalog";
import { formatNpr } from "@/lib/format";
import { useCart } from "@/lib/cart/cart-context";
import { Icon } from "./Icons";
import { SafeImage } from "./SafeImage";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "added" | "failed">("idle");
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const success = await addItem(product._id, 1);
    setStatus(success ? "added" : "failed");
    window.setTimeout(() => setStatus("idle"), 1500);
  };

  return (
    <div className="group relative block overflow-hidden rounded-lg bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.slug}`}>
        <div className="relative mb-3 aspect-square overflow-hidden rounded bg-neutral-100">
          <SafeImage src={product.image} alt={product.name} fill sizes="180px" className="object-cover transition group-hover:scale-105" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded bg-[#f4efd9] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#806505]">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="absolute right-3 top-3 rounded bg-green-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="truncate text-sm font-medium text-neutral-900">{product.name}</div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#c69c14]">
          {"*****"}
          <span className="text-neutral-500">({product.reviewCount})</span>
        </div>
      </Link>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="font-bold text-neutral-950">{formatNpr(product.price)}</div>
          {discountPercent > 0 && product.oldPrice ? (
            <div className="text-xs text-neutral-400 line-through">{formatNpr(product.oldPrice)}</div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          title={status === "failed" ? "Couldn't add to cart - try again" : undefined}
          className={`grid h-8 w-8 place-items-center rounded-full transition ${
            status === "added"
              ? "bg-emerald-500 text-white"
              : status === "failed"
                ? "bg-red-500 text-white"
                : "bg-[#d8b52f] text-[#5f4900] hover:bg-[#c9a828]"
          }`}
        >
          <Icon name={status === "added" ? "check" : "bag"} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
