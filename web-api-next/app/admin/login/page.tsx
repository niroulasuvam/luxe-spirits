"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { handleLoginAdmin } from "@/lib/actions/auth-action";
import { Icon } from "@/app/_components/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0d0f12] px-5 py-10 text-neutral-950">
      <Image
        src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&h=1200&fit=crop"
        alt="Dimly lit premium bar shelves"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[#0d0f12]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,181,47,0.20),transparent_34%)]" />
      <form
        className="relative w-full max-w-sm rounded-lg bg-white/95 p-8 shadow-2xl shadow-black/35 ring-1 ring-white/30 backdrop-blur"
        onSubmit={(event) => {
          event.preventDefault();
          setMessage("");
          const formData = new FormData(event.currentTarget);
          startTransition(async () => {
            const result = await handleLoginAdmin({
              email: String(formData.get("email") || ""),
              password: String(formData.get("password") || ""),
            });
            if (!result.success) {
              setMessage(result.message || "Login failed");
              return;
            }
            router.push("/admin");
            router.refresh();
          });
        }}
      >
        <h1 className="text-3xl font-bold text-[#806505]">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-600">Sign in with an account that has the admin role.</p>
        {message && <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
        <label className="mt-7 block text-sm font-semibold">Email</label>
        <input name="email" type="email" required className="mt-2 h-12 w-full rounded-lg border border-neutral-200 px-4 outline-none focus:border-[#d8b52f]" />
        <label className="mt-5 block text-sm font-semibold">Password</label>
        <div className="relative mt-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="h-12 w-full rounded-lg border border-neutral-200 px-4 pr-12 outline-none focus:border-[#d8b52f]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-100"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
          </button>
        </div>
        <button disabled={isPending} className="mt-7 h-12 w-full rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] disabled:opacity-60">
          {isPending ? "Signing in..." : "Login"}
        </button>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-[#806505]">
          Member login
        </Link>
      </form>
    </main>
  );
}
