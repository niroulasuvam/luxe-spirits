import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/_components/Icons";
import { ProductCard } from "@/app/_components/ProductCard";
import { handleListProducts } from "@/lib/actions/catalog-action";

export default async function DashboardPage() {
  const result = await handleListProducts();
  const products = result.data;
  const featuredProduct = products[0];

  return (
    <main className="px-5 py-8 lg:px-10">
          <section className="relative overflow-hidden rounded-lg bg-black px-8 py-14 text-white shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1400&h=600&fit=crop"
              alt="Premium single malt bottle"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover opacity-55"
            />
            <div className="relative max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#d8b52f]">Exclusive Collection</p>
              <h1 className="text-4xl font-bold md:text-5xl">Premium Single Malts</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
                Discover our curated selection of the world&apos;s finest whiskies, aged to perfection in charred oak casks from the Scottish Highlands.
              </p>
              {featuredProduct && (
                <Link href={`/product/${featuredProduct.slug}`} className="mt-8 inline-flex h-12 items-center rounded-full bg-[#d8b52f] px-9 text-sm font-semibold text-[#3c3106]">
                  Explore Rare Malts
                </Link>
              )}
            </div>
          </section>

          <section className="mt-12">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-semibold">Curated Inventory</h2>
                  <p className="mt-1 text-sm text-neutral-600">Showing {products.length} result{products.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex gap-3">
                  <button className="grid h-10 w-10 place-items-center rounded bg-[#f4efd9] text-[#806505]">
                    <Icon name="grid" className="h-5 w-5" />
                  </button>
                  <button className="grid h-10 w-10 place-items-center rounded bg-neutral-200 text-neutral-700">
                    <Icon name="list" className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="rounded-lg bg-white p-16 text-center text-neutral-500 shadow-sm ring-1 ring-black/5">
                  No products available yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              <section className="mt-12 grid overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_1.6fr]">
                <div className="relative min-h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=700&h=900&fit=crop"
                    alt="Liquor bottles on a bar shelf"
                    fill
                    sizes="(max-width: 768px) 100vw, 340px"
                    className="object-cover"
                  />
                </div>
                <div className="p-10">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#806505]">Browse Faster</p>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight">Find the right bottle for today</h2>
                  <p className="mt-5 max-w-md leading-7 text-neutral-600">
                    Jump straight to discounted bottles, high-value vintage picks, or search the full liquor list by name, category, and price.
                  </p>
                  <div className="mt-8 grid max-w-lg gap-4 text-sm sm:grid-cols-2">
                    <Link href="/offers" className="rounded bg-neutral-100 px-5 py-4 font-semibold text-neutral-700 hover:bg-[#f4efd9] hover:text-[#806505]">
                      Offers
                    </Link>
                    <Link href="/vintage" className="rounded bg-neutral-100 px-5 py-4 font-semibold text-neutral-700 hover:bg-[#f4efd9] hover:text-[#806505]">
                      Vintage
                    </Link>
                    <Link href="/search-liquor" className="rounded bg-neutral-100 px-5 py-4 font-semibold text-neutral-700 hover:bg-[#f4efd9] hover:text-[#806505]">
                      Search Liquor
                    </Link>
                    <Link href="/wishlist" className="rounded bg-neutral-100 px-5 py-4 font-semibold text-neutral-700 hover:bg-[#f4efd9] hover:text-[#806505]">
                      My Wishlist
                    </Link>
                  </div>
                  <Link href="/search-liquor" className="mt-10 inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-[#806505]">
                    Open full liquor search
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                </div>
              </section>
          </section>
    </main>
  );
}
