import Link from "next/link";
import { BackButton } from "@/app/_components/BackButton";
import { ProductCard } from "@/app/_components/ProductCard";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { getUserData } from "@/lib/cookies";
import { handleListProducts } from "@/lib/actions/catalog-action";

const VINTAGE_MIN_PRICE = 30000;

export default async function VintagePage() {
  const [user, result] = await Promise.all([getUserData(), handleListProducts()]);
  const vintageLiquors = result.data.filter((product) => product.price > VINTAGE_MIN_PRICE);

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-neutral-950">
      <SiteHeader user={user} />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <BackButton />
        <h1 className="text-4xl font-bold">Vintage</h1>
        <p className="mt-3 text-neutral-600">Liquors priced above NRP 30,000.</p>

        {vintageLiquors.length === 0 ? (
          <section className="mt-10 rounded-lg bg-white p-16 text-center shadow-sm ring-1 ring-black/5">
            <h2 className="text-2xl font-semibold">No vintage liquors yet</h2>
            <p className="mt-2 text-neutral-500">Liquors over NRP 30,000 will appear here.</p>
            <Link href="/dashboard" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]">
              Browse Collection
            </Link>
          </section>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
            {vintageLiquors.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
