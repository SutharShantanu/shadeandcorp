import { ActionButtons, MobileMenu, SearchBar, UserMenu, CategoryNavigation } from "@/components/site/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";
import Navbar from "@/components/site/Navbar";

// Define the shape of the API response
interface SingleProductResponse {
  success: boolean;
  data: any; // Ideally match Product interface
  error?: string;
}

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const json = await res.json() as SingleProductResponse;
    return json.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Calculate discount
  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercentage = product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border bg-gray-50">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover object-center"
                  priority
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    New Arrival
                  </span>
                )}
              </div>
              {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                      {product.images.map((img: string, i: number) => (
                          <div key={i} className="relative aspect-square rounded-lg border overflow-hidden cursor-pointer hover:border-black transition-colors">
                              <Image src={img} alt={`View ${i+1}`} fill className="object-cover" />
                          </div>
                      ))}
                  </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                 <h2 className="text-sm font-semibold text-primary tracking-wide uppercase">{product.brand}</h2>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight mb-4">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-2">{product.rating}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <span className="text-sm text-gray-500">{product.reviewCount} Reviews</span>
              </div>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-3xl font-bold">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through mb-1">${product.originalPrice}</span>
                    <span className="text-sm font-bold text-red-600 mb-1.5">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <Separator className="my-8" />

              <div className="prose prose-sm dark:prose-invert mb-8 text-gray-600 dark:text-gray-300">
                <p>{product.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
                  <div className="flex items-center border rounded-md">
                   <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none"><Minus className="w-4 h-4"/></Button>
                   <span className="w-12 text-center font-medium">1</span>
                   <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none"><Plus className="w-4 h-4"/></Button>
                  </div>
                  <Button size="lg" className="flex-1 h-12 text-base">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                      <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 shrink-0">
                      <Share2 className="w-5 h-5" />
                  </Button>
              </div>

              <div className="space-y-4 text-sm text-gray-500">
                 <div className="flex items-center gap-2">
                     <Check className="w-4 h-4 text-green-500" />
                     <span>Free delivery on orders over $50</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Check className="w-4 h-4 text-green-500" />
                     <span>30 days return policy</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
