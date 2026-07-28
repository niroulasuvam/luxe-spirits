"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import { RegisterFormSchema, type RegisterFormData } from "@/app/(auth)/_components/schema";
import { Icon } from "@/app/_components/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { ageVerified: false },
  });

  const onSubmit = (formData: RegisterFormData) => {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await handleRegisterUser(formData);

        if (result.success) {
          router.push("/login");
          return;
        }

        setMessage(result.message || "Registration failed");
      } catch {
        setMessage("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#f6f7f8] px-6 py-10 text-neutral-950">
      <section className="mx-auto max-w-[520px] rounded-2xl bg-white px-12 py-12 shadow-xl shadow-neutral-200/80">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join the Distillery</h1>
          <p className="mt-3 text-base leading-6 text-neutral-700">Experience the world&apos;s finest spirits with exclusive access.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          {message && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}

          <div>
            <label className="mb-2 block text-sm font-bold tracking-wide">Full Name</label>
            <div className="relative">
              <Icon name="user" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-700" />
              <input {...register("fullName")} className="h-16 w-full rounded-lg bg-[#f5f6f7] pl-14 pr-5 outline-none focus:ring-4 focus:ring-[#d8b52f]/15" placeholder="John Doe" />
            </div>
            {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold tracking-wide">Email Address</label>
            <div className="relative">
              <Icon name="mail" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-700" />
              <input type="email" {...register("email")} className="h-16 w-full rounded-lg bg-[#f5f6f7] pl-14 pr-5 outline-none focus:ring-4 focus:ring-[#d8b52f]/15" placeholder="john@example.com" />
            </div>
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-700" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-16 w-full rounded-lg bg-[#f5f6f7] pl-14 pr-12 outline-none focus:ring-4 focus:ring-[#d8b52f]/15"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide">Confirm Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-700" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="h-16 w-full rounded-lg bg-[#f5f6f7] pl-14 pr-12 outline-none focus:ring-4 focus:ring-[#d8b52f]/15"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-200"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  <Icon name={showConfirmPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <label className="flex items-start gap-4 text-base leading-7 text-neutral-800">
              <input type="checkbox" {...register("ageVerified")} className="mt-1 h-5 w-5 rounded border-neutral-300 text-[#d8b52f] focus:ring-[#d8b52f]" />
              I confirm that I am 18 years of age or older and agree to the <span className="font-semibold text-[#806505]">Terms of Service.</span>
            </label>
            {errors.ageVerified && <p className="mt-2 text-sm text-red-600">{errors.ageVerified.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="flex h-16 w-full items-center justify-center gap-3 rounded-lg bg-[#d8b52f] font-semibold tracking-wide text-[#3c3106] transition hover:bg-[#c9a828] disabled:opacity-60">
            {isSubmitting ? "Creating account..." : "Create Account"}
            <Icon name="arrow" className="h-5 w-5" />
          </button>
        </form>

        <div className="my-10 h-px bg-neutral-100" />

        <p className="text-center text-base text-neutral-700">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#806505]">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
