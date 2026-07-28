"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/app/_components/Icons";
import { updateProfileFormAction, type ProfileFormState } from "@/lib/actions/user-action";
import type { AuthUser } from "@/lib/api/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-14 w-full items-center justify-center rounded-lg bg-[#d8b52f] font-semibold text-[#3c3106] transition hover:bg-[#c9a828] disabled:opacity-60 sm:w-auto sm:px-10"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export function ProfileForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(user.profilePicture || null);
  const [state, formAction] = useActionState<ProfileFormState, FormData>(updateProfileFormAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  return (
    <form action={formAction} className="space-y-8">
      {state && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            state.success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.success ? "Profile updated successfully." : state.message || "Failed to update profile."}
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-[#f4efd9] ring-2 ring-[#d8b52f]/30">
          {preview ? (
            <Image src={preview} alt="Profile picture" fill className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-[#806505]">
              <Icon name="user" className="h-10 w-10" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Change Picture
          </button>
          <input ref={fileInputRef} type="file" name="avatar" accept="image/*" className="hidden" onChange={onPickFile} />
          <p className="mt-2 text-xs text-neutral-400">JPG or PNG, up to 5MB.</p>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold tracking-wide">Full Name</label>
        <input
          name="fullName"
          defaultValue={user.fullName || ""}
          className="h-14 w-full rounded-lg bg-[#f5f6f7] px-6 outline-none focus:ring-4 focus:ring-[#d8b52f]/15"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold tracking-wide">Email Address</label>
        <input
          value={user.email || ""}
          disabled
          className="h-14 w-full rounded-lg bg-neutral-100 px-6 text-neutral-500 outline-none"
        />
        <p className="mt-2 text-xs text-neutral-400">Email cannot be changed.</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold tracking-wide">Bio</label>
        <textarea
          name="bio"
          defaultValue={user.bio || ""}
          rows={4}
          maxLength={300}
          className="w-full rounded-lg bg-[#f5f6f7] px-6 py-4 outline-none focus:ring-4 focus:ring-[#d8b52f]/15"
          placeholder="Tell us a little about your taste in spirits"
        />
        <p className="mt-2 text-xs text-neutral-400">Up to 300 characters.</p>
      </div>

      <SubmitButton />
    </form>
  );
}
