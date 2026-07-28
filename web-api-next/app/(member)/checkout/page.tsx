"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/app/_components/Icons";
import { useCart } from "@/lib/cart/cart-context";
import { handleCreateOrder } from "@/lib/actions/order-action";
import { formatNpr } from "@/lib/format";
import { CheckoutFormSchema, type CheckoutFormData } from "./schema";

const TAX_RATE = 0.13;

export default function CheckoutPage() {
  const { items, subtotal, resetCart } = useCart();
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: { paymentMethod: "esewa", billingName: "", paymentReference: "", streetAddress: "", city: "Kathmandu", zipCode: "44600" },
  });
  const paymentMethod = useWatch({ control, name: "paymentMethod" });

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const onSubmit = (formData: CheckoutFormData) => {
    setErrorMessage(null);
    setPurchaseComplete(false);
    startTransition(async () => {
      try {
        const result = await handleCreateOrder(formData);
        if (result.success && result.data) {
          resetCart();
          setPurchaseComplete(true);
          window.setTimeout(() => {
            router.push(`/order-confirmed?order=${result.data.orderNumber}`);
            router.refresh();
          }, 900);
          return;
        }
        if ("authRequired" in result && result.authRequired) {
          router.push("/login");
          return;
        }
        setErrorMessage("message" in result && result.message ? result.message : "Failed to place order");
      } catch {
        setErrorMessage("Something went wrong. Please try again.");
      }
    });
  };

  const useCurrentLocation = () => {
    setLocationMessage(null);
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        setValue("locationCoordinates", coordinates, { shouldValidate: true });
        setValue("streetAddress", `Current location: ${coordinates}`, { shouldValidate: true });
        setLocationMessage("Location added. You can add nearby landmark details too.");
      },
      () => setLocationMessage("Please allow location access from your browser.")
    );
  };

  if (purchaseComplete) {
    return (
      <main className="mx-auto grid min-h-[60vh] max-w-3xl place-items-center px-5 py-20 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="orders" className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-bold">Purchase Complete</h1>
          <p className="mt-4 text-neutral-600">Taking you to your order details...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-4 text-neutral-600">Add a bottle to your cart before checking out.</p>
        <Link href="/dashboard" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]">
          Browse Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <section className="mb-20">
        <h1 className="text-5xl font-bold">Checkout</h1>
        <p className="mt-4 text-xl text-neutral-600">Complete your secure purchase of premium spirits.</p>
      </section>

      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
        )}
        <section className="grid gap-10 lg:grid-cols-[1.25fr_0.85fr]">
          <div className="space-y-10">
            <div className="rounded-lg bg-white p-10 shadow-sm ring-1 ring-black/5">
              <h2 className="mb-8 flex items-center gap-4 text-2xl font-semibold">
                <Icon name="lock" className="h-6 w-6 text-[#806505]" />
                Payment Method
              </h2>
              <div className="space-y-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`rounded-lg border p-5 ${paymentMethod === "esewa" ? "border-[#806505] bg-[#f4efd9]" : "border-neutral-200"}`}>
                    <input type="radio" value="esewa" {...register("paymentMethod")} className="sr-only" />
                    <span className="block text-lg font-bold text-[#806505]">eSewa</span>
                    <span className="mt-1 block text-sm text-neutral-600">Pay using your eSewa ID.</span>
                  </label>
                  <label className={`rounded-lg border p-5 ${paymentMethod === "mobile-banking" ? "border-[#806505] bg-[#f4efd9]" : "border-neutral-200"}`}>
                    <input type="radio" value="mobile-banking" {...register("paymentMethod")} className="sr-only" />
                    <span className="block text-lg font-bold text-[#806505]">MOBBANK</span>
                    <span className="mt-1 block text-sm text-neutral-600">Use mobile banking transfer.</span>
                  </label>
                </div>
                {errors.paymentMethod && <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>}
                <label className="block">
                  <span className="mb-3 block text-sm font-bold tracking-wide">Billing Name</span>
                  <input {...register("billingName")} className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none" placeholder="Your full name" />
                  {errors.billingName && <p className="mt-2 text-sm text-red-600">{errors.billingName.message}</p>}
                </label>
                <label className="block">
                  <span className="mb-3 block text-sm font-bold tracking-wide">
                    {paymentMethod === "esewa" ? "eSewa ID / Mobile Number" : "MOBBANK Reference / Mobile Number"}
                  </span>
                  <input {...register("paymentReference")} className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none" placeholder="98XXXXXXXX or transaction reference" />
                  {errors.paymentReference && <p className="mt-2 text-sm text-red-600">{errors.paymentReference.message}</p>}
                </label>
              </div>
            </div>

            <div className="rounded-lg bg-white p-10 shadow-sm ring-1 ring-black/5">
              <h2 className="mb-8 flex items-center gap-4 text-2xl font-semibold">
                <Icon name="home" className="h-6 w-6 text-[#806505]" />
                Billing Address
              </h2>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="mb-6 h-11 rounded-lg border border-[#d8b52f] px-5 text-sm font-semibold text-[#806505] hover:bg-[#f4efd9]"
              >
                Use my current location
              </button>
              {locationMessage && <p className="mb-5 text-sm text-neutral-600">{locationMessage}</p>}
              <input type="hidden" {...register("locationCoordinates")} />
              <div className="space-y-7">
                <label className="block">
                  <span className="mb-3 block text-sm font-bold tracking-wide">Actual Location / Landmark</span>
                  <input {...register("streetAddress")} className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none" placeholder="Tole, ward, nearby landmark or pinned location" />
                  {errors.streetAddress && <p className="mt-2 text-sm text-red-600">{errors.streetAddress.message}</p>}
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold tracking-wide">City</span>
                    <input {...register("city")} className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none" placeholder="Kathmandu" />
                    {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                  </label>
                  <label className="block">
                    <span className="mb-3 block text-sm font-bold tracking-wide">Postal Code</span>
                    <input {...register("zipCode")} className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none" placeholder="44600" />
                    {errors.zipCode && <p className="mt-2 text-sm text-red-600">{errors.zipCode.message}</p>}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-lg bg-white p-10 shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-semibold">Order Summary</h2>
            <div className="mt-8 max-h-64 space-y-5 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-neutral-500">
                      Qty: {item.quantity}
                      {item.oldPrice && item.oldPrice > item.price ? (
                        <span className="ml-2 line-through">{formatNpr(item.oldPrice)}</span>
                      ) : null}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatNpr(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="my-10 h-px bg-neutral-100" />
            <div className="space-y-5 text-base">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatNpr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-bold text-[#806505]">FREE</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax</span>
                <span>{formatNpr(tax)}</span>
              </div>
            </div>
            <div className="my-10 h-px bg-neutral-100" />
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold">Total</span>
              <div className="text-right">
                <div className="text-5xl font-bold">{formatNpr(total)}</div>
                <p className="text-xs text-neutral-500">Includes VAT where applicable.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || purchaseComplete}
              className={`mt-10 flex h-16 w-full items-center justify-center rounded-lg font-bold uppercase tracking-[0.14em] text-white transition disabled:opacity-80 ${
                purchaseComplete ? "bg-emerald-600" : "bg-[#d8b52f] hover:bg-[#c9a828]"
              }`}
            >
              {purchaseComplete ? "Purchase Complete" : isSubmitting ? "Processing..." : "Complete Purchase"}
            </button>
            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-400">
              <Icon name="shield" className="h-4 w-4" />
              Secure 256-bit SSL Encrypted Connection
            </p>
          </aside>
        </section>
      </form>
    </main>
  );
}
