"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/ProductCard";
import ProductCard from "@/components/site/ProductCard";

export function SimilarProducts({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(category)}&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = data?.data?.products ?? data?.products ?? [];
        const normalized = list
          .filter((p) => p.slug !== currentSlug)
          .slice(0, 6)
          .map((p) => ({
            ...p,
            variants: p.variants ?? [],
            assets: p.assets ?? [],
          }));
        setProducts(normalized);
      })
      .catch(() => {});
  }, [category, currentSlug]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
