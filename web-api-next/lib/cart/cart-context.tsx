"use client";

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CartData } from "@/lib/api/cart";
import {
  handleAddToCart,
  handleUpdateCartItem,
  handleRemoveCartItem,
  handleClearCart,
} from "@/lib/actions/cart-action";

const EMPTY_CART: CartData = { items: [], itemCount: 0, subtotal: 0 };

type CartMutationResult = { success: true; data: CartData } | { success: false; message?: string; authRequired?: boolean };

type CartContextValue = {
  items: CartData["items"];
  itemCount: number;
  subtotal: number;
  isPending: boolean;
  addItem: (productId: string, quantity?: number) => Promise<boolean>;
  setQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  resetCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart?: CartData;
}) {
  const [cart, setCart] = useState<CartData>(initialCart || EMPTY_CART);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const runMutation = useCallback(
    (mutation: () => Promise<CartMutationResult>) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const result = await mutation();
            if (result.success) {
              setCart(result.data);
              resolve(true);
              return;
            }
            if (result.authRequired) {
              router.push("/login");
            }
            resolve(false);
          } catch {
            resolve(false);
          }
        });
      }),
    [router]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: cart.items,
      itemCount: cart.itemCount,
      subtotal: cart.subtotal,
      isPending,
      addItem: (productId: string, quantity: number = 1) => runMutation(() => handleAddToCart(productId, quantity)),
      setQuantity: (productId: string, quantity: number) => runMutation(() => handleUpdateCartItem(productId, quantity)),
      removeItem: (productId: string) => runMutation(() => handleRemoveCartItem(productId)),
      clearCart: () => runMutation(() => handleClearCart()),
      resetCart: () => setCart(EMPTY_CART),
    }),
    [cart, isPending, runMutation]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
