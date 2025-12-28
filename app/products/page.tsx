import ActiveFilters from "@/components/site/ActiveFilters";
import ViewToggle from "@/components/site/ViewToggle";
import ProductCard from "@/components/site/ProductCard";
import ProductFilters from "@/components/site/ProductFilters";
import ProductSort from "@/components/site/ProductSort";
import ProductPagination from "@/components/site/Pagination";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AlertCircle, Filter, Search } from "lucide-react";
import Link from "next/link";

// Define the shape of the API response
interface ProductResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: any[]; 
  error?: string;
}

// Fetch products from the API
async function getProducts(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  
  const addParam = (key: string, value: string | string[] | undefined) => {
      if (value) {
          if (Array.isArray(value)) {
              params.append(key, value.join(","));
          } else {
              params.append(key, value);
          }
      }
  };

  addParam("category", searchParams.category);
  addParam("subCategory", searchParams.subCategory);
  addParam("search", searchParams.search);
  addParam("minPrice", searchParams.minPrice);
  addParam("maxPrice", searchParams.maxPrice);
  addParam("sort", searchParams.sort);
  addParam("brand", searchParams.brand);
  addParam("sizes", searchParams.sizes);
  addParam("colors", searchParams.colors);
  addParam("page", searchParams.page);
  
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  try {
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      cache: "no-store", // Ensure fresh data
    });
    
    if (!res.ok) {
        // Fallback or just throw
        // throw new Error(`Failed to fetch products: ${res.status}`);
        return { success: false, count: 0, total: 0, page: 1, totalPages: 0, data: [], error: `Failed to fetch products: ${res.status}` };
    }
    
    return await res.json() as ProductResponse;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, count: 0, total: 0, page: 1, totalPages: 0, data: [], error: "Failed to load products" };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { data: products, success, error, totalPages } = await getProducts(params);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="py-8 max-w-7xl mx-auto">
          {/* Header & Mobile Filter Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {params.category ? `${params.category} Collection` : "All Products"}
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
              
              {/* Sort Dropdown */}
              <ProductSort />
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
                     Try adjusting your filters or search terms to find what you're looking for.
                   </p>
                   <Button asChild className="mt-6">
                      <Link href="/products">Clear Filters</Link>
                   </Button>
                </div>
              ) : (
                <div className="space-y-8">
                    <div className={params.view === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
                    {products.map((product: any) => (
                        <ProductCard 
                            key={product._id || product.id} 
                            product={product} 
                            layout={params.view as "grid" | "list" || "grid"}
                        />
                    ))}
                    </div>
                    
                    <ProductPagination totalPages={totalPages} />
                </div>
              )}
            </main>
          </div>
        </div>
    </div>
  );
}


