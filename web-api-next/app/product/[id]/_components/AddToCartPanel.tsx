"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart/cart-context";
import type { Product } from "@/lib/api/catalog";

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "added" | "failed">("idle");

  const handleAdd = async () => {
    const success = await addItem(product._id, quantity);
    setStatus(success ? "added" : "failed");
    window.setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="mt-8 grid grid-cols-[130px_1fr] gap-4">
      <div className="grid h-12 grid-cols-3 rounded border border-neutral-200 bg-white text-center">
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="grid place-items-center border-x border-neutral-200">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((value) => Math.min(10, value + 1))}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className={`flex h-12 items-center justify-center rounded text-sm font-bold transition ${
          status === "failed" ? "bg-red-500 text-white" : "bg-[#d8b52f] text-[#3c3106] hover:bg-[#c9a828]"
        }`}
      >
        {status === "added" ? "Added to Cart ✓" : status === "failed" ? "Couldn't add — try again" : "Add to Cart"}
      </button>
      {status === "added" && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="col-span-2 text-center text-xs font-semibold text-[#806505] underline underline-offset-2"
        >
          View Cart
        </button>
      )}
    </div>
  );
}
