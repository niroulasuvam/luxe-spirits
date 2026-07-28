import Link from "next/link";
import { ProductCard } from "@/app/_components/ProductCard";
import { handleListCategories, handleListProducts } from "@/lib/actions/catalog-action";
import { LiveLiquorSearch } from "./_components/LiveLiquorSearch";
import { LiveMaxPriceSearch } from "./_components/LiveMaxPriceSearch";
import { AiLiquorSearch } from "./_components/AiLiquorSearch";

export default async function SearchLiquorPage({
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
  const products = productsResult.data;
  const categories = categoriesResult.data;

  return (
    <main className="px-5 py-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Search Liquor</h1>
        <p className="mt-3 text-neutral-600">Find drinks by liquor name, category, and maximum price.</p>
      </div>

      <AiLiquorSearch />

      <section className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-[#806505]">Liquor Name</label>
            <LiveLiquorSearch defaultValue={search} />
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#806505]">Category</p>
            <Link
              href={`/search-liquor${search || Number.isFinite(maxPrice) ? `?${[search ? `search=${encodeURIComponent(search)}` : "", Number.isFinite(maxPrice) ? `maxPrice=${maxPrice}` : ""].filter(Boolean).join("&")}` : ""}`}
              className="flex items-center gap-3 text-sm text-neutral-700"
            >
              <span className={`grid h-4 w-4 place-items-center rounded-full border ${!selectedCategory ? "border-[#806505]" : "border-neutral-300"}`}>
                {!selectedCategory && <span className="h-2 w-2 rounded-full bg-[#806505]" />}
              </span>
              All
            </Link>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.slug;
              const href = `/search-liquor?${[
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
                <Link href={`/search-liquor${queryParts.length ? `?${queryParts.join("&")}` : ""}`} className="block text-center text-xs font-semibold text-[#806505]">
                  Clear price
                </Link>
              )}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">All Drinks</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Showing {products.length} result{products.length === 1 ? "" : "s"}
                {Number.isFinite(maxPrice) ? ` at NRP ${maxPrice} or below` : ""}
              </p>
            </div>
            {(selectedCategory || search || Number.isFinite(maxPrice)) && (
              <Link href="/search-liquor" className="text-sm font-semibold text-[#806505] underline underline-offset-2">
                Clear all filters
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="rounded-lg bg-white p-16 text-center text-neutral-500 shadow-sm ring-1 ring-black/5">
              No liquors matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
