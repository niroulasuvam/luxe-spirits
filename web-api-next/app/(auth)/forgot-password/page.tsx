"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormSchema, type ForgotPasswordFormData } from "../_components/reset-schema";
import { handleForgotPassword, handleResetPasswordWithOtp } from "@/lib/actions/user-action";
import { Icon } from "@/app/_components/Icons";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordFormSchema),
  });

  const onSubmit = (formData: ForgotPasswordFormData) => {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await handleForgotPassword(formData.email);
        if (result.success) {
          setResetEmail(formData.email);
          setStep("otp");
          setMessage({
            type: "success",
            text: result.message || "OTP sent to your email.",
          });
        } else {
          setMessage({ type: "error", text: result.message || "Failed to send reset link." });
        }
      } catch {
        setMessage({ type: "error", text: "Something went wrong. Please try again." });
      }
    });
  };

  const onOtpSubmit = () => {
    setMessage(null);
    if (!/^\d{6}$/.test(otp)) {
      setMessage({ type: "error", text: "Enter the 6-digit OTP from your email." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    startTransition(async () => {
      const result = await handleResetPasswordWithOtp(resetEmail, otp, newPassword);
      if (result.success) {
        setMessage({ type: "success", text: "Password changed. Taking you back to login..." });
        window.setTimeout(() => router.push("/login"), 900);
        return;
      }
      setMessage({ type: "error", text: result.message || "Failed to reset password." });
    });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f8] px-6 text-neutral-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl shadow-neutral-200/80">
        <h1 className="text-2xl font-bold text-[#806505]">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Enter the email associated with your account and we&apos;ll send you an OTP to reset your password.
        </p>

        <form onSubmit={step === "email" ? handleSubmit(onSubmit) : (event) => { event.preventDefault(); onOtpSubmit(); }} className="mt-8 space-y-6">
          {message && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {step === "email" ? (
            <div>
              <label className="mb-3 block text-sm font-bold tracking-wide text-neutral-900">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#d8b52f] focus:ring-4 focus:ring-[#d8b52f]/15"
                placeholder="alexander@liquorhub.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          ) : (
            <div className="space-y-5">
              <p className="rounded-lg bg-neutral-100 px-4 py-3 text-sm text-neutral-600">OTP sent to {resetEmail}</p>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 text-center text-2xl font-bold tracking-[0.5em] text-neutral-900 outline-none focus:border-[#d8b52f]"
                placeholder="000000"
              />
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 pr-12 text-neutral-900 outline-none focus:border-[#d8b52f]"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-100"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  <Icon name={showNewPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-14 w-full rounded-lg border border-neutral-200 bg-transparent px-6 pr-12 text-neutral-900 outline-none focus:border-[#d8b52f]"
                  placeholder="Confirm password"
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
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-lg bg-[#d8b52f] font-semibold tracking-wide text-[#3c3106] shadow-lg shadow-[#d8b52f]/20 transition hover:bg-[#c9a828] disabled:opacity-60"
          >
            {step === "email" ? (isSubmitting ? "Sending OTP..." : "Send OTP") : (isSubmitting ? "Changing..." : "Proceed")}
          </button>
          {step === "otp" ? (
            <button type="button" onClick={() => setStep("email")} className="w-full text-sm font-semibold text-[#806505]">
              Change email
            </button>
          ) : null}
        </form>

        <p className="mt-8 text-center text-sm text-neutral-700">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[#806505]">
            Back to Login
          </Link>
        </p>

      </div>
    </main>
  );
}
