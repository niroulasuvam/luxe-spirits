import Link from "next/link";
import { ProductCard } from "@/app/_components/ProductCard";
import { handleListCategories, handleListProducts } from "@/lib/actions/catalog-action";
import { LiveLiquorSearch } from "@/app/(member)/search-liquor/_components/LiveLiquorSearch";
import { LiveMaxPriceSearch } from "@/app/(member)/search-liquor/_components/LiveMaxPriceSearch";

export default async function AdminSearchLiquorPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; maxPrice?: string; search?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "";
  const search = params.search || "";
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const queryParts = [
    selectedCategory ? `category=${selectedCategory}` : "",
    search ? `search=${encodeURIComponent(search)}` : "",
  ].filter(Boolean);

  const [productsResult, categoriesResult] = await Promise.all([
    handleListProducts({
      category: selectedCategory || undefined,
      search: search || undefined,
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    }),
    handleListCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="text-4xl font-bold">Search Liquor</h1>
      <p className="mt-2 text-neutral-600">Admin catalog search with live name and price filters.</p>

      <section className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#806505]">Liquor Name</label>
          <LiveLiquorSearch defaultValue={search} />

          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#806505]">Category</p>
            <Link href={`/admin/search-liquor${search || Number.isFinite(maxPrice) ? `?${[search ? `search=${encodeURIComponent(search)}` : "", Number.isFinite(maxPrice) ? `maxPrice=${maxPrice}` : ""].filter(Boolean).join("&")}` : ""}`} className="flex items-center gap-3 text-sm text-neutral-700">
              <span className={`grid h-4 w-4 place-items-center rounded-full border ${!selectedCategory ? "border-[#806505]" : "border-neutral-300"}`}>
                {!selectedCategory && <span className="h-2 w-2 rounded-full bg-[#806505]" />}
              </span>
              All
            </Link>
            {categoriesResult.data.map((category) => {
              const isSelected = selectedCategory === category.slug;
              const href = `/admin/search-liquor?${[
                `category=${category.slug}`,
                search ? `search=${encodeURIComponent(search)}` : "",
                Number.isFinite(maxPrice) ? `maxPrice=${maxPrice}` : "",
              ].filter(Boolean).join("&")}`;
              return (
                <Link key={category._id} href={href} className="flex items-center gap-3 text-sm text-neutral-700">
                  <span className={`grid h-4 w-4 place-items-center rounded-full border ${isSelected ? "border-[#806505]" : "border-neutral-300"}`}>
                    {isSelected && <span className="h-2 w-2 rounded-full bg-[#806505]" />}
                  </span>
                  {category.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#806505]">Maximum Price</p>
            <div className="mt-4 space-y-3">
              <LiveMaxPriceSearch defaultValue={Number.isFinite(maxPrice) ? String(maxPrice) : ""} />
              {Number.isFinite(maxPrice) && (
                <Link href={`/admin/search-liquor${queryParts.length ? `?${queryParts.join("&")}` : ""}`} className="block text-center text-xs font-semibold text-[#806505]">
                  Clear price
                </Link>
              )}
            </div>
          </div>
        </aside>

        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="mt-1 text-sm text-neutral-600">Showing {productsResult.data.length} liquor{productsResult.data.length === 1 ? "" : "s"}</p>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
            {productsResult.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
