"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormSchema, type ResetPasswordFormData } from "../../_components/reset-schema";
import { handleResetPassword } from "@/lib/actions/user-action";
import { Icon } from "@/app/_components/Icons";

export default function ResetPasswordPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordFormSchema),
  });

  const onSubmit = (formData: ResetPasswordFormData) => {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await handleResetPassword(params.token, formData.password);
        if (result.success) {
          setMessage({ type: "success", text: "Password reset successfully. Redirecting to login..." });
          window.setTimeout(() => router.push("/login"), 1800);
        } else {
          setMessage({ type: "error", text: result.message || "Failed to reset password." });
        }
      } catch {
        setMessage({ type: "error", text: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f8] px-6 text-neutral-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl shadow-neutral-200/80">
        <h1 className="text-2xl font-bold text-[#806505]">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">Choose a new password for your Liquor Hub account.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {message && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="mb-3 block text-sm font-bold tracking-wide text-neutral-900">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 pr-12 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#d8b52f] focus:ring-4 focus:ring-[#d8b52f]/15"
                placeholder="********"
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

          <div>
            <label className="mb-3 block text-sm font-bold tracking-wide text-neutral-900">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 pr-12 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#d8b52f] focus:ring-4 focus:ring-[#d8b52f]/15"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-100"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <Icon name={showConfirmPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-lg bg-[#d8b52f] font-semibold tracking-wide text-[#3c3106] shadow-lg shadow-[#d8b52f]/20 transition hover:bg-[#c9a828] disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-700">
          <Link href="/login" className="font-semibold text-[#806505]">
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
