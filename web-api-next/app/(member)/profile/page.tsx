import Link from "next/link";
import { getUserData } from "@/lib/cookies";
import { handleGetProfile } from "@/lib/actions/user-action";
import { ProfileForm } from "./_components/ProfileForm";

export default async function ProfilePage() {
  const cookieUser = await getUserData();
  const profileResult = cookieUser ? await handleGetProfile() : null;
  const user = profileResult?.success && profileResult.data ? profileResult.data : cookieUser;

  if (!user) {
    return (
      <main className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="text-3xl font-bold">Session expired</h1>
        <p className="mt-4 text-neutral-600">Please log in again to view your profile.</p>
        <Link href="/login" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]">
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 lg:px-8">
      <h1 className="text-4xl font-bold">My Profile</h1>
      <p className="mt-3 text-neutral-600">Manage your account details and profile picture.</p>

      <section className="mt-10 rounded-lg bg-white p-10 shadow-sm ring-1 ring-black/5">
        <ProfileForm key={`${user.fullName}:${user.profilePicture || ""}`} user={user} />
      </section>

      <section className="mt-8 rounded-lg bg-white p-10 shadow-sm ring-1 ring-black/5">
        <h2 className="text-xl font-semibold">Password</h2>
        <p className="mt-2 text-sm text-neutral-600">
          To change your password, request a secure reset link sent to your email.
        </p>
        <Link
          href="/forgot-password"
          className="mt-5 inline-flex h-11 items-center rounded-lg border border-neutral-200 px-6 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Send Password Reset Link
        </Link>
      </section>
    </main>
  );
}
