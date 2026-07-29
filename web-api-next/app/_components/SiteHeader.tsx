"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icon } from "./Icons";
import { NotificationsBell } from "./NotificationsBell";
import { useCart } from "@/lib/cart/cart-context";
import { handleLogout } from "@/lib/actions/auth-action";
import type { AuthUser } from "@/lib/api/auth";

export function SiteHeader({ compact = false, user = null }: { compact?: boolean; user?: AuthUser | null }) {
  const { itemCount } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const onLogout = () => {
    setMenuOpen(false);
    startLogoutTransition(async () => {
      await handleLogout();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#313942] bg-[#111418]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/dashboard" className="text-2xl font-bold text-[#c9a449]">
          Liquor Hub
        </Link>
        <nav className="hidden items-center gap-10 text-sm text-[#cbd5e1] md:flex">
          <Link href="/offers" className="hover:text-[#c9a449]">Offers</Link>
          <Link href="/vintage" className="hover:text-[#c9a449]">Vintage</Link>
        </nav>
        <div className="flex items-center gap-4 text-[#c9a449]">
          {!compact && user && (
            <NotificationsBell user={user} />
          )}
          <Link href="/cart" aria-label="Cart" className="relative">
            <Icon name="bag" className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#806505] text-[9px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Account menu"
                className="flex items-center gap-2"
              >
                {user.profilePicture ? (
                  <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-[#d8b52f]">
                    <Image src={user.profilePicture} alt={user.fullName || "Profile"} fill className="object-cover" />
                  </div>
                ) : (
                  <Icon name="user" className="h-5 w-5" />
                )}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-9 w-44 overflow-hidden rounded-lg bg-[#171b20] py-2 text-sm text-[#f4f0e8] shadow-xl ring-1 ring-[#313942]">
                  <p className="truncate px-4 pb-2 text-xs font-semibold text-neutral-400">{user.fullName || user.email}</p>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-neutral-50" onClick={() => setMenuOpen(false)}>
                    My Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" aria-label="Account">
              <Icon name="user" className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
