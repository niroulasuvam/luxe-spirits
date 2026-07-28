"use client";

import { useState, useTransition } from "react";
import { ProductCard } from "@/app/_components/ProductCard";
import { handleAiSearchProducts } from "@/lib/actions/catalog-action";
import type { Product } from "@/lib/api/catalog";

export function AiLiquorSearch() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setAnswer("");
    setProducts([]);

    startTransition(async () => {
      const result = await handleAiSearchProducts(prompt);
      if (!result.success || !result.data) {
        setMessage(result.message || "AI search failed");
        return;
      }

      setAnswer(result.data.answer);
      setProducts(result.data.products || []);
    });
  };

  return (
    <section className="mb-8 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#806505]">Gemini AI Search</p>
          <h2 className="mt-2 text-2xl font-bold">Ask for the bottle you want</h2>
          <p className="mt-1 text-sm text-neutral-500">Try: sweet vodka under 5000, gift whisky, or strong liquor for a party.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          required
          placeholder="Tell Gemini what you want..."
          className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-sm outline-none focus:border-[#806505]"
        />
        <button disabled={isPending} className="h-12 rounded-lg bg-[#d8b52f] px-6 text-sm font-bold text-[#3c3106] disabled:opacity-60">
          {isPending ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p> : null}
      {answer ? <p className="mt-4 rounded-lg bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-700">{answer}</p> : null}

      {products.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
