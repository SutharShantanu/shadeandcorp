"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Sparkles,
  ArrowRight,
  Layers,
  ShoppingBag,
  Compass,
} from "lucide-react";
import CuratedCollections, {
  CollectionItem,
} from "@/components/site/CuratedCollections";
import LookbookHotspots, {
  LookbookHotspot,
} from "@/components/site/LookbookHotspots";
import FilterableCatalog from "@/components/site/FilterableCatalog";
import SectionCtaButton from "@/components/site/SectionCtaButton";
import type { Product } from "@/types/ProductCard";

const rawProducts = [
  {
    id: "1",
    title: "Slim Fit Cotton Shirt",
    description:
      "Tailored from premium breathable organic cotton. Crisp collar design with reinforced stitch finish.",
    brand: "Zara",
    price: 45.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&h=1200&fit=crop",
    ],
    category: "Shirts",
    slug: "slim-fit-cotton-shirt",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Slate Gray", value: "#374151" },
      { name: "Crimson", value: "#DC2626" },
    ],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isTrending: true,
    discount: 23,
    rating: 4.8,
    reviewCount: 128,
    sku: "ZARA-SHIRT-001",
  },
  {
    id: "2",
    title: "Designer Denim Jacket",
    description:
      "Classic vintage-wash oversized denim jacket crafted with heavy-duty copper hardware.",
    brand: "H&M",
    price: 89.99,
    originalPrice: 119.99,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1000&h=1200&fit=crop",
    ],
    category: "Jackets",
    slug: "designer-denim-jacket",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Indigo Blue", value: "#1E40AF" },
      { name: "Onyx Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 8,
    isNew: true,
    isBestSeller: true,
    discount: 25,
    rating: 4.9,
    reviewCount: 89,
    sku: "HM-JACKET-002",
  },
  {
    id: "3",
    title: "Premium Wool Knit Sweater",
    description:
      "Ultra-soft Merino wool blend knit engineered for warmth without added bulk.",
    brand: "Massimo Dutti",
    price: 75.5,
    originalPrice: 95.0,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&h=1200&fit=crop",
    ],
    category: "Sweaters",
    slug: "premium-wool-sweater",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Amber Gold", value: "#F59E0B" },
      { name: "Ruby Red", value: "#EF4444" },
      { name: "Midnight", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 12,
    isNew: true,
    discount: 20,
    rating: 4.7,
    reviewCount: 64,
    sku: "MD-SWEATER-003",
  },
  {
    id: "4",
    title: "Skinny Tapered Denim Jeans",
    description:
      "Flex-stretch denim designed for maximum agility, form retention, and modern silhouette.",
    brand: "Levi's",
    price: 68.99,
    originalPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1000&h=1200&fit=crop",
    ],
    category: "Jeans",
    slug: "skinny-fit-jeans",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Charcoal", value: "#1F2937" },
      { name: "Pure Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 20,
    isNew: true,
    isTrending: true,
    discount: 14,
    rating: 4.6,
    reviewCount: 203,
    sku: "LEVI-JEANS-004",
  },
  {
    id: "5",
    title: "Casual Silk Summer Dress",
    description:
      "Flowing breathable silk blend with vibrant floral accents and comfortable elastic waistline.",
    brand: "Mango",
    price: 55.99,
    originalPrice: 75.99,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&h=1200&fit=crop",
    ],
    category: "Dresses",
    slug: "casual-summer-dress",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Rose Pink", value: "#EC4899" },
      { name: "Ivory White", value: "#FFFFFF" },
      { name: "Amber Glow", value: "#F59E0B" },
    ],
    inStock: true,
    stockQuantity: 6,
    isNew: true,
    discount: 26,
    rating: 4.8,
    reviewCount: 95,
    sku: "MANGO-DRESS-005",
  },
  {
    id: "6",
    title: "Sports Performance Tee",
    description:
      "Dri-FIT technology engineered for active cooling, lightweight movement, and zero irritation.",
    brand: "Nike",
    price: 35.99,
    originalPrice: 45.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&h=1200&fit=crop",
    ],
    category: "T-Shirts",
    slug: "sports-performance-tee",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Jet Black", value: "#000000" },
      { name: "Optic White", value: "#FFFFFF" },
      { name: "Varsity Red", value: "#DC2626" },
    ],
    inStock: true,
    stockQuantity: 25,
    isNew: true,
    isBestSeller: true,
    discount: 22,
    rating: 4.7,
    reviewCount: 156,
    sku: "NIKE-TEE-006",
  },
  {
    id: "7",
    title: "Tailored Italian Blazer",
    description:
      "Hand-stitched European wool blazer with satin lapel detailing and slim contemporary fit.",
    brand: "Hugo Boss",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&h=1200&fit=crop",
    ],
    category: "Blazers",
    slug: "formal-blazer",
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Deep Obsidian", value: "#000000" },
      { name: "Graphite Gray", value: "#374151" },
    ],
    inStock: true,
    stockQuantity: 5,
    isNew: true,
    discount: 20,
    rating: 4.9,
    reviewCount: 42,
    sku: "HB-BLAZER-007",
  },
  {
    id: "8",
    title: "Urban Retro Sneakers",
    description:
      "Cushioned cloud foam sole paired with premium leather overlays and retro silhouette.",
    brand: "Adidas",
    price: 89.99,
    originalPrice: 109.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&h=1200&fit=crop",
    ],
    category: "Footwear",
    slug: "casual-sneakers",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [
      { name: "Cloud White", value: "#FFFFFF" },
      { name: "Core Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 14,
    isNew: true,
    isTrending: true,
    discount: 18,
    rating: 4.8,
    reviewCount: 178,
    sku: "ADIDAS-SNK-008",
  },
];

const newArrivals: Product[] = rawProducts.map((p) => {
  const variants = p.sizes.flatMap((size, sizeIndex) =>
    p.colors.map((color, colorIndex) => ({
      id: `${p.id}-v-${size}-${color.name}`,
      color: { name: color.name, hex: color.value },
      size: size,
      sku: `${p.sku}-${size}-${color.name.substring(0, 3).toUpperCase()}`,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      stockQuantity: p.stockQuantity,
      isDefault: sizeIndex === 0 && colorIndex === 0,
    })),
  );

  const assets = p.images.map((url, index) => ({
    id: `${p.id}-asset-${index}`,
    type: "image" as const,
    role: "gallery" as const,
    url,
    alt: p.title,
    order: index,
  }));

  return {
    ...p,
    basePrice: p.price,
    variants,
    assets,
  };
});

const collectionsData: CollectionItem[] = [
  {
    id: "col-1",
    title: "Summer Oasis 2024",
    tagline: "RESORT EDITION",
    subtitle:
      "Breathable organic linens and sun-washed tones engineered for warm coastal days. Designed with relaxed fits, lightweight textures, and refined silhouettes to keep you cool, comfortable, and effortlessly stylish all season long.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&h=1200&fit=crop",
    stockStatus: "Limited Edition",
    season: "Summer '24",
    slug: "summer-oasis-2024",
  },
  {
    id: "col-2",
    title: "Urban Minimalist",
    tagline: "CONTEMPORARY TAILORING",
    subtitle:
      "Architectural cuts, heavy denim, and clean monochromatic layering for modern city living. Crafted for high versatility with functional details, structured proportions, and premium sustainable materials designed to endure.",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&h=1200&fit=crop",
    stockStatus: "Limited Drop",
    season: "Capsule Drop",
    slug: "urban-minimalist",
  },
  {
    id: "col-3",
    title: "Monochrome Noir",
    tagline: "HIGH FASHION EDITION",
    subtitle:
      "Deep obsidian tailoring, wool knits, and hand-finished European outerwear. Featuring bold contrasting textures, sleek silhouettes, and timeless dark aesthetics tailored specifically for cold evening statement looks.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&h=1200&fit=crop",
    stockStatus: "Limited Stock",
    season: "Fall Preview",
    slug: "monochrome-noir",
  },
];

export default function NewArrivals() {
  const [activeTab, setActiveTab] = useState("collections");

  // Hotspots data for Editorial Lookbook
  const lookbookHotspots: LookbookHotspot[] = useMemo(
    () => [
      {
        id: "pin-1",
        top: "24%",
        left: "48%",
        product: newArrivals[6], // Tailored Italian Blazer
      },
      {
        id: "pin-2",
        top: "58%",
        left: "54%",
        product: newArrivals[3], // Skinny Tapered Jeans
      },
      {
        id: "pin-3",
        top: "84%",
        left: "46%",
        product: newArrivals[7], // Urban Retro Sneakers
      },
    ],
    [],
  );

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto">
        {/* Luxury Header */}
        <SectionHeader
          badgeIcon={<Sparkles className="size-3.5 text-primary" />}
          badgeText="Season 2024 • Newly Dropped"
          title="New Arrivals & Collections"
          description="Discover our curated runway lookbooks, thematic drops, and interactive shop-the-look hotspot features."
        />

        {/* SHADCN TABS NAVIGATION: Collections vs Lookbook vs All Products */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full items-center gap-8"
        >
          <TabsList className="mx-auto">
            <TabsTrigger value="collections" className="h-fit">
              <Layers className="size-4" />
              <span>Curated Collections</span>
              <Badge
                variant={
                  activeTab === "collections" ? "default" : "warning-outline"
                }
              >
                3 Drops
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="lookbook" className="h-fit">
              <Compass className="size-4" />
              <span>Shop The Look</span>
              <Badge
                variant={
                  activeTab === "lookbook" ? "default" : "warning-outline"
                }
              >
                Hotspots
              </Badge>
            </TabsTrigger>

            <TabsTrigger value="products" className="h-fit">
              <ShoppingBag className="size-4" />
              <span>All New Arrivals</span>
              <Badge
                variant={
                  activeTab === "products" ? "default" : "warning-outline"
                }
              >
                {newArrivals.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* TAB CONTENT 1: CURATED COLLECTIONS */}
          <TabsContent value="collections" className="w-full">
            <CuratedCollections collections={collectionsData} />
          </TabsContent>

          {/* TAB CONTENT 2: SHOP THE LOOK EDITORIAL HOTSPOTS */}
          <TabsContent value="lookbook" className="w-full">
            <LookbookHotspots hotspots={lookbookHotspots} />
          </TabsContent>

          {/* TAB CONTENT 3: ALL NEW ARRIVALS CATALOG GRID */}
          <TabsContent value="products" className="w-full">
            <FilterableCatalog products={newArrivals} />
          </TabsContent>
        </Tabs>

        {/* View All CTA Button */}
        <SectionCtaButton href="/products?sort=newest">
          Explore Entire Runway Catalog
        </SectionCtaButton>
      </div>
    </section>
  );
}
