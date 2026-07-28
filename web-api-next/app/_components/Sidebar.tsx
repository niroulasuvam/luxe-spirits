"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Icon } from "./Icons";
import { handleLogout } from "@/lib/actions/auth-action";
import type { AuthUser } from "@/lib/api/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Search Liquor", href: "/search-liquor", icon: "search" },
  { label: "My Cart", href: "/cart", icon: "bag" },
  { label: "My Wishlist", href: "/wishlist", icon: "heart" },
  { label: "My Orders", href: "/orders", icon: "orders" },
  { label: "My Profile", href: "/profile", icon: "user" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const;

export function Sidebar({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const displayName = user?.fullName || "Guest";

  const onLogout = () => {
    startLogoutTransition(async () => {
      await handleLogout();
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <aside className="hidden min-h-[calc(100vh-64px)] border-r border-[#313942] bg-[#111418] lg:flex lg:flex-col">
      <div className="flex items-center gap-4 px-8 py-9">
        {user?.profilePicture ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-[#d8b52f]">
            <Image src={user.profilePicture} alt={displayName} fill className="object-cover" />
          </div>
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
            <Icon name="user" className="h-5 w-5" />
          </div>
        )}
        <div>
          <div className="text-sm font-bold">{displayName}</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500">Premium Member</div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-8 py-3 text-sm font-medium ${
                isActive ? "border-r-4 border-[#f2c14e] bg-[#242b33] text-[#f2c14e]" : "text-[#cbd5e1] hover:bg-[#20262d]"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 px-8 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
        >
          <Icon name="support" className="h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </nav>

      <div className="mt-auto px-8 pb-10">
        <Link href="/dashboard" className="mb-8 flex h-10 items-center justify-center rounded bg-[#d8b52f] text-sm font-semibold text-[#3c3106]">
          View Storefront
        </Link>
      </div>
    </aside>
  );
}
