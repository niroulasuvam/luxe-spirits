"use client";

import { useActionState } from "react";
import { handleNotifyUsers } from "@/lib/actions/admin-action";

export function NotifyUsersForm() {
  const [state, formAction, isPending] = useActionState(handleNotifyUsers, { success: false, message: "" });

  return (
    <form action={formAction} className="mt-8 max-w-2xl rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-2xl font-bold">Send Notification</h2>
      <p className="mt-2 text-sm text-neutral-500">All active users will receive this in their notification bell.</p>

      {state.message && (
        <p className={`mt-5 rounded-lg px-4 py-3 text-sm ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </p>
      )}

      <div className="mt-6 grid gap-5">
        <label>
          <span className="mb-2 block text-sm font-bold">Title</span>
          <input
            name="title"
            required
            placeholder="e.g. Weekend Offer"
            className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 outline-none focus:border-[#806505]"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Message</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Write the message users should see..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 outline-none focus:border-[#806505]"
          />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold">Image</span>
          <input name="image" type="file" accept="image/*" className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3" />
          <span className="mt-2 block text-xs text-neutral-500">Optional. Leave empty to send text only.</span>
        </label>
      </div>

      <button disabled={isPending} className="mt-6 h-12 w-full rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] disabled:opacity-60">
        {isPending ? "Sending..." : "Notify Users"}
      </button>
    </form>
  );
}
