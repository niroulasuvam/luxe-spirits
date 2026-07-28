import { ProductForm } from "../_components/ProductForm";
import { handleAdminCatalogOptions, handleAdminProducts } from "@/lib/actions/admin-action";
import { LiquorEditForm } from "./_components/LiquorEditForm";

export default async function AdminLiquorsPage() {
  const [{ categories, brands }, productsResult] = await Promise.all([
    handleAdminCatalogOptions(),
    handleAdminProducts(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="text-4xl font-bold">Add Liquor</h1>
      <p className="mt-2 text-neutral-600">Add, view, edit, and delete liquors in one simple place.</p>
      <div className="mt-8">
        <ProductForm categories={categories} brands={brands} />
      </div>
      <section className="mt-10">
        <h2 className="text-2xl font-bold">All Liquors</h2>
        <div className="mt-5 space-y-4">
          {productsResult.data.map((product) => (
            <LiquorEditForm key={product._id} product={product} categories={categories} brands={brands} />
          ))}
        </div>
      </section>
    </main>
  );
}
