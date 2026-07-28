import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/app/_components/Icons";
import { ProductCard } from "@/app/_components/ProductCard";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { SiteHeader } from "@/app/_components/SiteHeader";
import { BackButton } from "@/app/_components/BackButton";
import { formatNpr } from "@/lib/format";
import { getUserData } from "@/lib/cookies";
import { handleGetProduct, handleListProducts } from "@/lib/actions/catalog-action";
import { handleGetWishlist } from "@/lib/actions/wishlist-action";
import { handleListReviews } from "@/lib/actions/review-action";
import { AddToCartPanel } from "./_components/AddToCartPanel";
import { WishlistButton } from "./_components/WishlistButton";
import { ReviewsSection } from "./_components/ReviewsSection";
import { SafeImage } from "@/app/_components/SafeImage";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [productResult, user] = await Promise.all([handleGetProduct(id), getUserData()]);

  if (!productResult.success || !productResult.data) {
    notFound();
  }

  const product = productResult.data;

  const [allProductsResult, wishlistResult, reviewsResult] = await Promise.all([
    handleListProducts(),
    handleGetWishlist(),
    handleListReviews(product._id),
  ]);

  const relatedProducts = allProductsResult.data.filter((item) => item._id !== product._id).slice(0, 4);
  const isWishlisted = wishlistResult.success
    ? (wishlistResult.data?.products || []).some((item) => item._id === product._id)
    : false;

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-neutral-950">
      <SiteHeader compact user={user} />
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <BackButton />
        <div className="mb-10 text-xs font-semibold text-neutral-500">
          Collections <span className="mx-2">›</span> {product.categoryId.name} <span className="mx-2">›</span>{" "}
          <span className="text-[#806505]">{product.name}</span>
        </div>

        <section className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="rounded-lg bg-white p-16 shadow-sm ring-1 ring-black/5">
              <div className="relative aspect-[1.15]">
                <SafeImage src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 90vw, 620px" className="object-contain" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            {product.badge && (
              <p className="mb-4 inline-flex rounded bg-[#f4efd9] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#806505]">{product.badge}</p>
            )}
            <h1 className="max-w-md text-5xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-3 text-lg font-semibold text-[#806505]">{product.brandId.name}</p>
            <div className="mt-6 flex items-end gap-4">
              <span className="text-3xl font-semibold">{formatNpr(product.price)}</span>
              {product.oldPrice && <span className="text-sm text-neutral-400 line-through">{formatNpr(product.oldPrice)}</span>}
            </div>

            <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200 text-sm">
              <div className="flex justify-between py-4">
                <span className="text-neutral-500">Origin</span>
                <span>{product.origin}</span>
              </div>
              <div className="flex justify-between py-4">
                <span className="text-neutral-500">ABV</span>
                <span>{product.abv}</span>
              </div>
              <div className="py-4">
                <span className="text-neutral-500">Tasting Notes</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span key={note} className="rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-700">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <AddToCartPanel product={product} />
            <WishlistButton productId={product._id} initiallyWishlisted={isWishlisted} />

            <div className="mt-8 flex gap-4 rounded-lg bg-white p-5 text-sm shadow-sm ring-1 ring-black/5">
              <Icon name="shield" className="mt-1 h-5 w-5 text-[#806505]" />
              <div>
                <p className="font-semibold">Distillery Guarantee</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">Authenticity verified and insured shipping included on all vintage collections.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-neutral-200 pt-10">
          <div className="mb-8 flex gap-10 text-sm font-semibold text-neutral-500">
            <span className="border-b-2 border-[#806505] pb-3 text-[#806505]">Description</span>
            <span>Specifications</span>
            <span>Reviews ({product.reviewCount})</span>
            <span>Shipping & Returns</span>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="max-w-3xl space-y-5 text-sm leading-7 text-neutral-700">
              <p>{product.description}</p>
            </div>
            <aside className="rounded-lg bg-white p-8 shadow-lg shadow-neutral-200/70">
              <h2 className="text-xl font-semibold">Distiller&apos;s Note</h2>
              <p className="mt-5 text-sm italic leading-7 text-neutral-600">
                We watched these casks carefully before deciding this was the moment of peak expression.
              </p>
              <p className="mt-6 text-sm font-semibold text-[#806505]">Master Distiller</p>
            </aside>
          </div>
        </section>

        <section className="mt-16 border-t border-neutral-200 pt-10">
          <h2 className="mb-8 text-3xl font-semibold">Reviews ({product.reviewCount})</h2>
          <ReviewsSection productId={product._id} initialReviews={reviewsResult.data} />
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-semibold">Related Collections</h2>
                <p className="mt-1 text-sm text-neutral-500">Curated pairings from our master cellar.</p>
              </div>
              <Link href="/dashboard" className="hidden items-center gap-2 text-sm font-semibold text-[#806505] md:flex">
                View All <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
