"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/app/_components/Icons";
import { handleChangePassword } from "@/lib/actions/user-action";
import { useActionState } from "react";

export function SettingsPanel() {
  const [dayMode, setDayMode] = useState(() => typeof window !== "undefined" && localStorage.getItem("luxe_appearance") === "day");
  const [notifications, setNotifications] = useState(() => typeof window === "undefined" || localStorage.getItem("luxe_notifications") !== "false");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordState, passwordAction, isChangingPassword] = useActionState(handleChangePassword, { success: false, message: "" });

  useEffect(() => {
    localStorage.setItem("luxe_appearance", dayMode ? "day" : "luxe");
    localStorage.removeItem("luxe_dark_mode");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.toggle("light", dayMode);
  }, [dayMode]);

  useEffect(() => {
    localStorage.setItem("luxe_notifications", String(notifications));
  }, [notifications]);

  const toggleClass = (checked: boolean) =>
    `relative inline-flex h-7 w-12 items-center rounded-full transition ${checked ? "bg-[#806505]" : "bg-neutral-300"}`;

  const knobClass = (checked: boolean) =>
    `inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "translate-x-6" : "translate-x-1"}`;

  return (
    <section className="mt-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-black/5">
      <div className="space-y-4">
        <label className="flex items-center justify-between gap-5 rounded-lg border border-neutral-100 p-5">
          <span className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
              <Icon name="moon" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold">Day Mode</span>
              <span className="text-sm text-neutral-500">Switch between the Luxe dark style and a lighter day style.</span>
            </span>
          </span>
          <button type="button" role="switch" aria-checked={dayMode} onClick={() => setDayMode((value) => !value)} className={toggleClass(dayMode)}>
            <span className={knobClass(dayMode)} />
          </button>
        </label>

        <label className="flex items-center justify-between gap-5 rounded-lg border border-neutral-100 p-5">
          <span className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
              <Icon name="bell" className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold">Notifications</span>
              <span className="text-sm text-neutral-500">Show order and account notification indicators.</span>
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((value) => !value)}
            className={toggleClass(notifications)}
          >
            <span className={knobClass(notifications)} />
          </button>
        </label>
      </div>

      <form action={passwordAction} className="mt-8 border-t border-neutral-100 pt-8">
        <h2 className="text-2xl font-bold">Change Password</h2>
        {passwordState.message && (
          <p className={`mt-4 rounded-lg px-4 py-3 text-sm ${passwordState.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {passwordState.message}
          </p>
        )}
        <div className="mt-6 grid gap-5">
          <div className="relative">
            <input name="currentPassword" type={showCurrentPassword ? "text" : "password"} required placeholder="Current password" className="h-12 w-full rounded-lg bg-[#f5f6f7] px-4 pr-12 outline-none" />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((value) => !value)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-200"
              aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
            >
              <Icon name={showCurrentPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <input name="newPassword" type={showNewPassword ? "text" : "password"} required minLength={6} placeholder="New password" className="h-12 w-full rounded-lg bg-[#f5f6f7] px-4 pr-12 outline-none" />
            <button
              type="button"
              onClick={() => setShowNewPassword((value) => !value)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-200"
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              <Icon name={showNewPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required minLength={6} placeholder="Confirm new password" className="h-12 w-full rounded-lg bg-[#f5f6f7] px-4 pr-12 outline-none" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-[#f2c14e] transition hover:bg-neutral-200"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              <Icon name={showConfirmPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
            </button>
          </div>
          <button disabled={isChangingPassword} className="h-12 rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] disabled:opacity-60">
            {isChangingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </section>
  );
}
