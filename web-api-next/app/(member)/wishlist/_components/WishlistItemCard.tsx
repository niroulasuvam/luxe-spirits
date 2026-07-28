"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Icon } from "@/app/_components/Icons";
import { SafeImage } from "@/app/_components/SafeImage";
import { handleToggleWishlist } from "@/lib/actions/wishlist-action";
import type { WishlistProduct } from "@/lib/api/wishlist";
import { formatNpr } from "@/lib/format";

export function WishlistItemCard({ product }: { product: WishlistProduct }) {
  const [removed, setRemoved] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (removed) {
    return null;
  }

  const removeFromWishlist = () => {
    setMessage("");
    startTransition(async () => {
      const result = await handleToggleWishlist(product._id);
      if (result.success) {
        setRemoved(true);
        return;
      }
      setMessage("Could not remove this item. Try again.");
    });
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
          <SafeImage src={product.image} alt={product.name} fill sizes="220px" className="object-cover" />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded bg-[#f4efd9] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#806505]">
              {product.badge}
            </span>
          )}
        </div>
        <h2 className="mt-4 truncate text-base font-bold">{product.name}</h2>
        <p className="mt-1 font-semibold text-[#806505]">{formatNpr(product.price)}</p>
      </Link>
      {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      <button
        type="button"
        onClick={removeFromWishlist}
        disabled={isPending}
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-100 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        <Icon name="heart" className="h-4 w-4" />
        {isPending ? "Removing..." : "Remove from Wishlist"}
      </button>
    </div>
  );
}
