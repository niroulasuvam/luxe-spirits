import { SiteHeader } from "@/app/_components/SiteHeader";
import { Sidebar } from "@/app/_components/Sidebar";
import { getUserData } from "@/lib/cookies";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserData();

  return (
    <div className="min-h-screen bg-[#f6f7f8] text-neutral-950">
      <SiteHeader user={user} />
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[230px_1fr]">
        <Sidebar user={user} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
