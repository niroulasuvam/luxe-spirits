import Image from "next/image";
import { OrderTracker } from "@/app/_components/OrderTracker";
import { handleAdminOrders, handleUpdateOrderStatus } from "@/lib/actions/admin-action";
import { formatNpr } from "@/lib/format";

export default async function AdminOrdersPage() {
  const result = await handleAdminOrders();
  const orders = result.data;
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="text-4xl font-bold">Revenue Orders</h1>
      <p className="mt-2 text-neutral-600">Total revenue: <span className="font-bold text-[#806505]">{formatNpr(revenue)}</span></p>
      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <section key={order._id} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap justify-between gap-5 border-b border-neutral-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#806505]">Order</p>
                <p className="mt-1 font-semibold">#{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#806505]">Customer</p>
                <p className="mt-1 font-semibold">{order.userId?.fullName || "Unknown user"}</p>
                <p className="text-sm text-neutral-500">{order.userId?.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#806505]">Ship To</p>
                <p className="mt-1 text-sm text-neutral-700">
                  {order.shippingAddress.streetAddress}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wide text-[#806505]">Total</p>
                <p className="mt-1 text-lg font-bold">{formatNpr(order.total)}</p>
                <p className="mt-1 text-sm font-semibold capitalize text-neutral-500">{order.status}</p>
              </div>
            </div>
            <div className="mt-5">
              {order.status === "pending" ? (
                <form action={handleUpdateOrderStatus.bind(null, order._id, "accepted")} className="flex flex-wrap items-end gap-4 rounded-lg border border-[#313942] bg-[#151a20] p-5">
                  <label className="grid gap-2 text-sm font-semibold text-[#f3f6f8]">
                    Delivery time after acceptance
                    <input
                      name="estimatedHours"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Hours"
                      className="h-11 w-36 rounded-lg border border-[#3c4652] bg-[#20262d] px-3 text-base text-[#f3f6f8] outline-none placeholder:text-[#b7c0ca] focus:border-[#f2c14e]"
                    />
                  </label>
                  <button className="h-11 rounded-lg bg-[#f2c14e] px-5 text-sm font-bold text-[#14100a] transition hover:bg-[#ffd36a]">Accept Order</button>
                </form>
              ) : (
                <OrderTracker status={order.status} expectedDelivery={order.expectedDelivery} />
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "accepted" ? (
                  <form action={handleUpdateOrderStatus.bind(null, order._id, "shipped")} className="flex flex-wrap items-end gap-2">
                    <label className="grid gap-1 text-xs font-semibold text-[#f3f6f8]">
                      Shipping hours
                      <input
                        name="estimatedHours"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Hours"
                        className="h-10 w-28 rounded-lg border border-[#3c4652] bg-[#20262d] px-3 text-sm text-[#f3f6f8] outline-none placeholder:text-[#b7c0ca] focus:border-[#f2c14e]"
                      />
                    </label>
                    <button className="h-10 rounded-lg bg-[#f2c14e] px-3 text-sm font-semibold text-[#14100a] transition hover:bg-[#ffd36a]">Mark Shipped</button>
                  </form>
                ) : null}
                {order.status === "shipped" ? (
                  <form action={handleUpdateOrderStatus.bind(null, order._id, "delivered")}>
                    <button className="h-10 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white">Mark Delivered</button>
                  </form>
                ) : null}
                {order.status !== "delivered" && order.status !== "cancelled" ? (
                  <form action={handleUpdateOrderStatus.bind(null, order._id, "cancelled")}>
                    <button className="h-10 rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50">Cancel Order</button>
                  </form>
                ) : null}
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={`${order._id}-${item.productId}`} className="flex items-center gap-4 rounded-lg border border-neutral-100 p-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-sm text-neutral-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatNpr(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
