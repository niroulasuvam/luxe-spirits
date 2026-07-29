import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/_components/Icons";
import { OrderTracker } from "@/app/_components/OrderTracker";
import { AutoRefresh } from "@/app/_components/AutoRefresh";
import { handleListOrders } from "@/lib/actions/order-action";
import { formatNpr } from "@/lib/format";

export default async function OrdersPage() {
  const result = await handleListOrders();
  const orders = result.data;

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
      <AutoRefresh intervalMs={8000} />
      <h1 className="text-4xl font-bold">My Orders</h1>
      <p className="mt-3 text-neutral-600">A record of every order you&apos;ve placed with Liquor Hub.</p>

      {orders.length === 0 ? (
        <div className="mt-16 rounded-lg bg-white p-16 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
            <Icon name="orders" className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-neutral-500">Your completed purchases will show up here.</p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]"
          >
            Browse Collection
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Order Number</p>
                  <p className="mt-2 text-lg font-semibold">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Placed On</p>
                  <p className="mt-2 text-lg font-semibold">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Status</p>
                  <p className="mt-2 inline-flex rounded-full bg-[#f4efd9] px-3 py-1 text-sm font-semibold capitalize text-[#806505]">
                    {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Total</p>
                  <p className="mt-2 text-lg font-semibold">{formatNpr(order.total)}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.status === "pending" ? (
                  <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700">
                    Your order is waiting for admin acceptance. Tracking will appear after it is accepted.
                  </div>
                ) : (
                  <OrderTracker status={order.status} expectedDelivery={order.expectedDelivery} />
                )}
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatNpr(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href={`/order-confirmed?order=${order.orderNumber}`}
                  className="text-sm font-semibold text-[#806505] underline underline-offset-2"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
