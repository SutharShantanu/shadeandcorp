"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/site/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { add, remove, clear, hydrate } from "@/features/wishlist/wishlistSlice";
import { Product } from "@/types/ProductCard";

// Map raw type/category to high-level collection names
function mapTypeToCollection(type?: string, category?: string): string {
  const t = (type || "").toLowerCase();
  const c = (category || "").toLowerCase();

  // Topwear
  if (
    [
      "shirt",
      "t-shirt",
      "tshirt",
      "top",
      "blouse",
      "sweatshirt",
      "sweater",
      "hoodie",
      "jacket",
    ].includes(t)
  )
    return "topwear";
  if (
    [
      "shirts",
      "t-shirts",
      "tops",
      "sweaters",
      "sweatshirts",
      "jackets",
    ].includes(c)
  )
    return "topwear";

  // Bottomwear
  if (
    [
      "jeans",
      "trouser",
      "trousers",
      "pants",
      "shorts",
      "skirt",
      "leggings",
    ].includes(t)
  )
    return "bottomwear";
  if (["jeans", "trousers", "shorts", "skirts", "leggings"].includes(c))
    return "bottomwear";

  // Footwear
  if (
    [
      "shoe",
      "shoes",
      "sneaker",
      "sneakers",
      "boot",
      "boots",
      "heel",
      "sandals",
    ].includes(t)
  )
    return "footwear";
  if (["footwear", "sneakers", "boots", "shoes", "sandals"].includes(c))
    return "footwear";

  // Accessories
  if (
    [
      "belt",
      "watch",
      "sunglasses",
      "cap",
      "hat",
      "bag",
      "backpack",
      "jewelry",
      "scarf",
      "gloves",
    ].includes(t)
  )
    return "accessories";
  if (
    [
      "accessories",
      "belts",
      "watches",
      "sunglasses",
      "bags",
      "wallets",
      "jewelry",
      "scarves",
    ].includes(c)
  )
    return "accessories";

  // Dresses
  if (["dress", "maxi dress", "party dress"].includes(t)) return "dresses";
  if (["dresses", "party dresses", "maxi dresses"].includes(c))
    return "dresses";

  // Winter wear
  if (
    ["winter wear", "sweater", "jacket", "coat"].includes(c) ||
    ["parka", "coat"].includes(t)
  )
    return "winter wear";

  // Fallback to provided category or generic
  return category?.toLowerCase() || "others";
}

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);
  const [search, setSearch] = useState("");
  const [collection, setCollection] = useState<string>("all");
  const [sort, setSort] = useState<string>("recent");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  // Load on mount
  useEffect(() => {
    dispatch(hydrate());
  }, []);

  // Derived grouped collections
  const collections = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((p) => {
      const col = mapTypeToCollection((p as any).type, p.category);
      map.set(col, (map.get(col) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q),
      );
    }

    // Collection filter
    if (collection !== "all") {
      list = list.filter(
        (p) => mapTypeToCollection((p as any).type, p.category) === collection,
      );
    }

    // Price filter
    const min = priceMin ? parseFloat(priceMin) : undefined;
    const max = priceMax ? parseFloat(priceMax) : undefined;

    const getPrice = (p: Product) =>
      p.variants?.find((v) => v.isDefault)?.price ?? p.basePrice ?? 0;
    const getDiscount = (p: Product) => {
      const variant = p.variants?.find((v) => v.isDefault) || p.variants?.[0];
      if (!variant) return 0;
      if (variant.discount) return variant.discount;
      if (variant.originalPrice && variant.price) {
        return Math.round(
          ((variant.originalPrice - variant.price) / variant.originalPrice) *
            100,
        );
      }
      return 0;
    };

    if (min !== undefined)
      list = list.filter((p) => getPrice(p as Product) >= min);
    if (max !== undefined)
      list = list.filter((p) => getPrice(p as Product) <= max);

    // Sort
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => getPrice(a as Product) - getPrice(b as Product));
        break;
      case "price-desc":
        list.sort((a, b) => getPrice(b as Product) - getPrice(a as Product));
        break;
      case "discount":
        list.sort(
          (a, b) => getDiscount(b as Product) - getDiscount(a as Product),
        );
        break;
      default:
        // recent: assume original order
        break;
    }

    return list;
  }, [items, search, collection, priceMin, priceMax, sort]);

  // Actions
  const removeItem = (id: string, title?: string) => {
    dispatch(remove(id));
    if (title) {
      toast.info(`${title} removed from wishlist`, { id: `wishlist-${id}` });
    } else {
      toast.info("Removed from wishlist", { id: `wishlist-${id}` });
    }
  };

  const clearWishlist = () => {
    dispatch(clear());
    toast.info("Wishlist cleared");
  };

  const addToCart = (
    product: Product,
    quantity: number,
    size: string,
    color: string,
  ) => {
    // Stub: integrate with cart later
    toast.success(`${product.title} added to bag`);
  };

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Wishlist</h1>
            <p className="text-sm text-muted-foreground">
              Save products you love and shop later.
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-4 md:items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by title, brand, category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Collection</label>
            <Select value={collection} onValueChange={setCollection}>
              <SelectTrigger>
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {collections.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.key}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({c.count})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Sort</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="discount">Best Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price filter */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:max-w-sm">
          <div>
            <label className="text-sm font-medium">Min Price</label>
            <Input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Price</label>
            <Input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Collections badges */}
        {collections.length > 0 && (
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              <Badge
                onClick={() => setCollection("all")}
                className={`cursor-pointer ${collection === "all" ? "bg-black text-white" : ""}`}
              >
                All ({items.length})
              </Badge>
              {collections.map((c) => (
                <Badge
                  key={c.key}
                  onClick={() => setCollection(c.key)}
                  className={`cursor-pointer ${collection === c.key ? "bg-black text-white" : ""}`}
                >
                  {c.key} ({c.count})
                </Badge>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">Your wishlist is empty.</p>
            <Button className="mt-4" asChild>
              <a href="/">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
            {filtered.map((product) => (
              <div key={product.id} className="relative break-inside-avoid">
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={() => {
                    // Toggle: if present, remove; if absent, add
                    const exists = items.some((p) => p.id === product.id);
                    if (exists) {
                      removeItem(product.id, product.title);
                    } else {
                      dispatch(add(product));
                      toast.success(`${product.title} added to wishlist!`, {
                        id: `wishlist-${product.id}`,
                      });
                    }
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="capitalize">
                    {mapTypeToCollection(
                      (product as any).type,
                      product.category,
                    )}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => removeItem(product.id, product.title)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
