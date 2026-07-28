import Link from "next/link";
import { handleAdminOrders, handleAdminProducts, handleAdminUsers } from "@/lib/actions/admin-action";
import { formatNpr } from "@/lib/format";
import { AdminBarChart } from "./_components/AdminBarChart";

function getLastTwelveMonths() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
      month: date.getMonth(),
      users: 0,
      revenue: 0,
    };
  });
}

export default async function AdminPage() {
  const [ordersResult, productsResult, usersResult] = await Promise.all([
    handleAdminOrders(),
    handleAdminProducts(),
    handleAdminUsers(),
  ]);
  const revenue = ordersResult.data.reduce((sum, order) => sum + order.total, 0);
  const monthlyData = getLastTwelveMonths();
  const monthIndex = new Map(monthlyData.map((item, index) => [item.key, index]));

  for (const user of usersResult.data) {
    if (!user.createdAt) continue;
    const date = new Date(user.createdAt);
    const index = monthIndex.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (index !== undefined) monthlyData[index].users += 1;
  }

  for (const order of ordersResult.data) {
    const date = new Date(order.createdAt);
    const index = monthIndex.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (index !== undefined) monthlyData[index].revenue += order.total;
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Overview</h1>
        <p className="mt-2 text-neutral-600">Quick view of revenue, orders, liquors, and users.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-4">
        <Link href="/admin/orders" className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-neutral-500">Total Revenue</p>
          <p className="mt-3 text-3xl font-bold text-[#806505]">{formatNpr(revenue)}</p>
        </Link>
        <Link href="/admin/orders" className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-neutral-500">Orders</p>
          <p className="mt-3 text-3xl font-bold">{ordersResult.data.length}</p>
        </Link>
        <Link href="/admin/liquors" className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-neutral-500">Liquors</p>
          <p className="mt-3 text-3xl font-bold">{productsResult.data.length}</p>
        </Link>
        <Link href="/admin/users" className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-semibold text-neutral-500">Users</p>
          <p className="mt-3 text-3xl font-bold">{usersResult.data.length}</p>
        </Link>
      </div>
      <AdminBarChart data={monthlyData} />
    </main>
  );
}
