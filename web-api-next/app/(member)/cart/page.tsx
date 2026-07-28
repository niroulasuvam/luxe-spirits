"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/_components/Icons";
import { useCart } from "@/lib/cart/cart-context";
import { formatNpr } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, isPending } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        <h1 className="text-4xl font-bold">Your Cart</h1>
        <p className="mt-3 text-neutral-600">Review your selection before checking out.</p>

        {items.length === 0 ? (
          <div className="mt-16 rounded-lg bg-white p-16 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
              <Icon name="bag" className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-neutral-500">Browse the collection and add a bottle to get started.</p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-5 rounded-lg bg-white p-5 shadow-sm ring-1 ring-black/5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-semibold hover:text-[#806505]">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-neutral-500">
                          {formatNpr(item.price)} each
                          {item.oldPrice && item.oldPrice > item.price ? (
                            <span className="ml-2 text-xs line-through">{formatNpr(item.oldPrice)}</span>
                          ) : null}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        disabled={isPending}
                        aria-label={`Remove ${item.name} from cart`}
                        className="text-xs font-semibold text-neutral-400 hover:text-red-500 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-28 grid-cols-3 rounded border border-neutral-200 bg-white text-center text-sm">
                        <button type="button" disabled={isPending} onClick={() => setQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">
                          -
                        </button>
                        <span className="grid place-items-center border-x border-neutral-200">{item.quantity}</span>
                        <button type="button" disabled={isPending} onClick={() => setQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                      <div className="font-bold">{formatNpr(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-lg bg-white p-8 shadow-sm ring-1 ring-black/5">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <div className="mt-6 flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatNpr(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">Tax and shipping calculated at checkout.</p>
              <Link
                href="/checkout"
                className="mt-8 flex h-14 items-center justify-center rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] transition hover:bg-[#c9a828]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
    </main>
  );
}
