import Link from "next/link";
import { Icon } from "@/app/_components/Icons";
import { handleGetWishlist } from "@/lib/actions/wishlist-action";
import { WishlistItemCard } from "./_components/WishlistItemCard";

export default async function WishlistPage() {
  const result = await handleGetWishlist();
  const products = result.data?.products || [];

  return (
    <main className="px-5 py-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Wishlist</h1>
        <p className="mt-3 text-neutral-600">Everything you have saved for later.</p>
      </div>

      {products.length === 0 ? (
        <section className="rounded-lg bg-white p-16 text-center shadow-sm ring-1 ring-black/5">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f4efd9] text-[#806505]">
            <Icon name="heart" className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">No wishlist items</h2>
          <p className="mt-2 text-neutral-500">Tap the heart on a liquor page to save it here.</p>
          <Link href="/search-liquor" className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-8 text-sm font-semibold text-[#3c3106]">
            Search Liquor
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <WishlistItemCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
