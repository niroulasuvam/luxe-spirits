import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/_components/Icons";
import { handleGetOrder } from "@/lib/actions/order-action";
import { formatNpr } from "@/lib/format";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const result = orderNumber ? await handleGetOrder(orderNumber) : null;
  const order = result?.success ? result.data : null;

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold">No recent order found</h1>
        <p className="mt-4 text-neutral-600">Place an order to see your confirmation here.</p>
        <Link href="/dashboard" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]">
          Browse Collection
        </Link>
      </main>
    );
  }

  const expectedDelivery = new Date(order.expectedDelivery).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="px-6 py-16">
      <section className="mx-auto max-w-4xl text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#f4efd9] text-[#d0a900]">
          <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#d0a900]">
            <Icon name="check" className="h-8 w-8" />
          </div>
        </div>
        <h1 className="mt-12 text-5xl font-bold">Cheers! Your Order is Confirmed</h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-neutral-600">
          Your premium selection is being prepared for delivery. We&apos;ve sent a confirmation email to your registered address.
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-4xl rounded-lg bg-white p-12 shadow-lg shadow-neutral-200/80 ring-1 ring-black/5">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Order Number</p>
            <p className="mt-3 text-2xl font-semibold">#{order.orderNumber}</p>
          </div>
          <div className="md:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Expected Delivery</p>
            <p className="mt-3 text-2xl font-semibold">{expectedDelivery}</p>
          </div>
        </div>

        <div className="my-8 h-px bg-[#d8c994]" />

        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item.productId} className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{item.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{formatNpr(item.price * item.quantity)}</p>
                <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-8 h-px bg-[#d8c994]" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <span className="text-2xl font-semibold">Total Amount</span>
          <span className="text-5xl font-bold text-[#806505]">{formatNpr(order.total)}</span>
        </div>
      </section>

      <div className="mx-auto mt-12 flex max-w-xl flex-col justify-center gap-6 sm:flex-row">
        <Link href="/orders" className="flex h-24 min-w-56 items-center justify-center rounded-full bg-[#d8b52f] px-10 text-center text-2xl font-semibold text-[#3c3106]">
          My Orders
        </Link>
        <Link href="/dashboard" className="flex h-24 min-w-56 items-center justify-center rounded-full border-2 border-[#c8b985] bg-white px-10 text-center text-2xl font-semibold">
          Browse More
        </Link>
      </div>

      <p className="mt-14 text-center text-neutral-600">
        Need help? <span className="font-semibold text-[#806505]">Contact our Concierge Service</span>
      </p>
    </main>
  );
}
