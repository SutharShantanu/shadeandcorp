import ActiveFilters from "@/components/site/ActiveFilters";
import ViewToggle from "@/components/site/ViewToggle";
import ProductFilters from "@/components/site/ProductFilters";
import ProductSort from "@/components/site/ProductSort";
import ProductPagination from "@/components/site/Pagination";
import ProductGrid from "@/components/site/ProductGrid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertCircle, Filter, Search, X } from "lucide-react";
import Link from "next/link";

import { fetchProducts } from "@/lib/product-logic";

// Fetch results helper (optional, can just call fetchProducts)
async function getProductsFromLib(searchParams: any) {
  return await fetchProducts(searchParams);
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug || [];

  // Map slug to filters
  const category = slug[0]; // e.g., 'men'
  const potentialSubCategory = slug[2] || slug[1]; // e.g., 't-shirts' from /men/clothing/t-shirts or /accessories/belts

  // Helper to capitalize first letter and handle special cases
  const formatValue = (val: string) => {
    if (!val) return undefined;

    // Check if it's a known category with specific casing
    const categories = ["Men", "Women", "Kids", "Accessories", "Collections"];
    const matchedCategory = categories.find(c => c.toLowerCase() === val.toLowerCase());
    if (matchedCategory) return matchedCategory;

    // List of values that should keep their hyphen
    const hyphenated = ["T-Shirts"];
    const matchedHyphenated = hyphenated.find(h => h.toLowerCase() === val.toLowerCase());
    if (matchedHyphenated) return matchedHyphenated;

    // Default: capitalize words and replace hyphens with spaces
    return val.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Ignore intermediate navigation segments like "clothing", "footwear" etc.
  // Only use subcategory if it's a specific product type
  const intermediateSegments = ["clothing", "footwear", "accessories"];
  const subCategory = intermediateSegments.includes(potentialSubCategory?.toLowerCase())
    ? undefined
    : potentialSubCategory;

  const filters: any = {
    ...resolvedSearchParams,
    category: formatValue(category) || resolvedSearchParams.category,
    subCategory: subCategory ? formatValue(subCategory) : resolvedSearchParams.subCategory,
  };

  const { data: products, success, error, totalPages } = await getProductsFromLib(filters as any);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="py-8 max-w-7xl mx-auto">
        {/* Header & Mobile Filter Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {filters.category || "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {success ? `${products.length} Items` : "No items found"}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="lg:hidden w-full md:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <ProductFilters />
                </SheetContent>
              </Sheet>
            </div>

            {/* Layout & Sort */}
            <div className="flex items-center gap-3">
              <ViewToggle />
              <ProductSort />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters />
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <ActiveFilters />

            {error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-red-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold">Error loading products</h3>
                <p>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-zinc-100 rounded-full p-6 mb-4">
                  <Search className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <Button asChild variant="secondary" size="sm" className="mt-6 gap-1 rounded-full text-xs">
                  <Link href={`/products${slug.length > 0 ? `/${slug.join('/')}` : ''}`}>
                    Clear Filters
                    <X className="size-3 hover:text-destructive" />
                  </Link>
                </Button>

              </div>
            ) : (
              <div className="space-y-8">
                <ProductGrid products={products} filters={filters} />

                <ProductPagination totalPages={totalPages} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}


