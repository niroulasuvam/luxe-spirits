import Link from "next/link";
import { headers } from "next/headers";
import { getAdminUserData } from "@/lib/cookies";
import { handleAdminLogout } from "@/lib/actions/auth-action";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname");
  const user = await getAdminUserData();
  const nav = [
    { label: "Overview", href: "/admin" },
    { label: "Add Liquor", href: "/admin/liquors" },
    { label: "Search Liquor", href: "/admin/search-liquor" },
    { label: "Revenue Orders", href: "/admin/orders" },
    { label: "Users", href: "/admin/users" },
    { label: "Notify Users", href: "/admin/notify" },
  ];

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f4f0e8]">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="border-r border-[#313942] bg-[#111418] p-6">
          <Link href="/admin" className="text-2xl font-bold text-[#c9a449]">Luxe Admin</Link>
          <nav className="mt-10 space-y-2">
            {user?.role === "admin" && nav.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-lg px-4 py-3 text-sm font-semibold text-[#cbd5e1] hover:bg-[#242b33] hover:text-[#f2c14e]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10 space-y-2 border-t border-neutral-100 pt-6">
            {user?.role === "admin" && (
              <form action={handleAdminLogout}>
                <button className="w-full rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Logout</button>
              </form>
            )}
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
