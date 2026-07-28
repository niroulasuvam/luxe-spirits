"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "@/app/_components/Icons";
import { handleToggleWishlist } from "@/lib/actions/wishlist-action";

export function WishlistButton({ productId, initiallyWishlisted }: { productId: string; initiallyWishlisted: boolean }) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(initiallyWishlisted);
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    startTransition(async () => {
      try {
        const result = await handleToggleWishlist(productId);
        if (result.success) {
          setIsWishlisted((prev) => !prev);
        } else if (result.authRequired) {
          router.push("/login");
        }
      } catch {
        // silently ignore — the button just stays in its current state
      }
    });
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isPending}
      className={`mt-4 flex h-12 w-full items-center justify-center gap-3 rounded border text-sm transition disabled:opacity-60 ${
        isWishlisted ? "border-[#d8b52f] bg-[#f4efd9] text-[#806505]" : "border-neutral-200 bg-white text-neutral-700"
      }`}
    >
      <Icon name="heart" className="h-5 w-5" />
      {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
    </button>
  );
}
