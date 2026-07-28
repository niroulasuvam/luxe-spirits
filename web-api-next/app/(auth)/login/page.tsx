"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, type LoginFormData } from "../_components/schema";
import { handleGoogleLoginUser, handleLoginUser } from "@/lib/actions/auth-action";
import { GoogleAccountButton } from "../_components/GoogleAccountButton";
import { Icon } from "@/app/_components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = (formData: LoginFormData) => {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await handleLoginUser(formData);

        if (result.success) {
          router.push("/dashboard");
          router.refresh();
          return;
        }

        setMessage(result.message || "Login failed");
      } catch {
        setMessage("Something went wrong. Please try again.");
      }
    });
  };

  const onGoogleCredential = (credential: string) => {
    setMessage("");
    startTransition(async () => {
      const result = await handleGoogleLoginUser(credential);
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setMessage(result.message || "Google login failed");
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f7f8] text-neutral-950">
      <div className="grid min-h-screen lg:grid-cols-[1.45fr_1fr]">
        <section className="flex items-center justify-center bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] bg-[length:18px_18px] px-8 py-14">
          <div className="w-full max-w-[560px] text-center">
            <div className="relative mx-auto aspect-square max-w-[450px] overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=900&h=900&fit=crop"
                alt="Luxe Spirits whiskey decanter"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 450px"
                className="object-cover"
              />
            </div>
            <h1 className="mt-12 text-3xl font-bold text-[#806505]">The Art of Distillation</h1>
            <p className="mx-auto mt-5 max-w-md text-lg leading-8 text-neutral-700">
              Experience the world&apos;s most exclusive spirits, curated for the discerning palate and managed with absolute precision.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-8 py-14">
          <div className="flex min-h-[760px] w-full max-w-[390px] flex-col">
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-[#806505]">Luxe Spirits</h2>
              <p className="mt-3 max-w-xs text-base leading-6 text-neutral-700">Please enter your credentials to access the vault.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-20 space-y-6">
              <div className="flex justify-end">
                <Link href="/admin/login" className="text-sm font-bold text-[#806505] hover:underline">
                  Admin Login -&gt;
                </Link>
              </div>

              {message && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}

              <div>
                <label className="mb-3 block text-sm font-bold tracking-wide text-neutral-900">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#d8b52f] focus:ring-4 focus:ring-[#d8b52f]/15"
                  placeholder="alexander@luxespirits.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-bold tracking-wide text-neutral-900">Password</label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#806505]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 pr-12 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#d8b52f] focus:ring-4 focus:ring-[#d8b52f]/15"
                    placeholder="************"
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
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <label className="flex items-center gap-3 text-sm text-neutral-700">
                <input type="checkbox" className="h-3 w-3 rounded border-neutral-300 text-[#d8b52f] focus:ring-[#d8b52f]" />
                Remember me for 30 days
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-16 w-full rounded-lg bg-[#d8b52f] font-semibold tracking-wide text-[#3c3106] shadow-lg shadow-[#d8b52f]/20 transition hover:bg-[#c9a828] disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-neutral-500">
                <span className="h-px flex-1 bg-neutral-200" />
                Or
                <span className="h-px flex-1 bg-neutral-200" />
              </div>
              <GoogleAccountButton disabled={isSubmitting} onCredential={onGoogleCredential} />
            </form>

            <p className="mt-20 text-sm text-neutral-800">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-[#806505]">
                Apply for membership
              </Link>
            </p>

            <p className="mt-auto pb-3 text-center text-xs text-neutral-400">© 2024 Luxe Spirits Distillery. All Rights Reserved.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
