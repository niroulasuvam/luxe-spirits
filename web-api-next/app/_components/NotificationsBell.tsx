"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
import { SafeImage } from "./SafeImage";
import type { AuthUser } from "@/lib/api/auth";
import type { NotificationItem } from "@/lib/api/notifications";
import { handleClearNotifications, handleListNotifications, handleMarkNotificationsRead } from "@/lib/actions/notification-action";

export function NotificationsBell({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const displayName = user.fullName || user.email || "member";

  useEffect(() => {
    const loadNotifications = () => {
      handleListNotifications().then((result) => setNotifications(result.data || []));
    };
    loadNotifications();
    const interval = window.setInterval(loadNotifications, 8000);
    return () => window.clearInterval(interval);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative grid h-9 w-9 place-items-center rounded-full bg-neutral-50 text-[#765d08] hover:bg-[#f4efd9]"
      >
        <Icon name="bell" className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-lg bg-white text-neutral-900 shadow-xl ring-1 ring-black/5">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <div>
              <p className="font-bold">Notifications</p>
              <p className="text-xs text-neutral-500">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                const result = await handleMarkNotificationsRead();
                setNotifications(result.data || []);
              }}
              className="text-xs font-semibold text-[#806505]"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="font-semibold text-neutral-900">Welcome back, {displayName}</p>
                <p className="mt-2 text-sm leading-6 text-neutral-500">Hope you will buy something. Thank you!!</p>
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item._id}
                  href={item.href || "#"}
                  className="flex w-full gap-3 border-b border-neutral-100 px-4 py-4 text-left hover:bg-neutral-50"
                >
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-neutral-300" : "bg-red-500"}`} />
                  <span className="min-w-0">
                    {item.image ? (
                      <span className="relative mb-3 block h-28 overflow-hidden rounded-lg bg-neutral-100">
                        <SafeImage src={item.image} alt={item.title} fill sizes="280px" className="object-cover" />
                      </span>
                    ) : null}
                    <span className="block text-sm font-semibold">{item.title}</span>
                    <span className="mt-1 block text-sm text-neutral-600">{item.message}</span>
                    <span className="mt-2 block text-xs text-neutral-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </span>
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-neutral-100 p-3">
            <button
              type="button"
              onClick={async () => {
                const result = await handleClearNotifications();
                setNotifications(result.data || []);
              }}
              className="h-10 w-full rounded-lg border border-red-100 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
