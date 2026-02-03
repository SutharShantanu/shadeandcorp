"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from "@/components/site/ProductCard";
import type { Product } from "@/types/ProductCard";

const rawProducts = [
  {
    id: "1",
    title: "Slim Fit Cotton Shirt",
    brand: "Zara",
    price: 45.99,
    originalPrice: 59.99,
    images: ["/products/shirt-1.jpg", "/products/shirt-2.jpg"],
    category: "Shirts",
    slug: "slim-fit-cotton-shirt",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#374151" },
      { name: "Red", value: "#DC2626" },
    ],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isTrending: true,
    discount: 23,
    rating: 4.5,
    reviewCount: 128,
    sku: "ZARA-SHIRT-001",
  },
  {
    id: "2",
    title: "Designer Denim Jacket",
    brand: "H&M",
    price: 89.99,
    originalPrice: 119.99,
    images: ["/products/jacket-1.jpg", "/products/jacket-2.jpg"],
    category: "Jackets",
    slug: "designer-denim-jacket",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Navy", value: "#1E40AF" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 8,
    isNew: true,
    isBestSeller: true,
    discount: 25,
    rating: 4.8,
    reviewCount: 89,
    sku: "HM-JACKET-002",
  },
  {
    id: "3",
    title: "Premium Wool Sweater",
    brand: "Massimo Dutti",
    price: 75.5,
    originalPrice: 75.5,
    images: ["/products/sweater-1.jpg", "/products/sweater-2.jpg"],
    category: "Sweaters",
    slug: "premium-wool-sweater",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Amber", value: "#F59E0B" },
      { name: "Red", value: "#EF4444" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 12,
    isNew: true,
    rating: 4.3,
    reviewCount: 64,
    sku: "MD-SWEATER-003",
  },
  {
    id: "4",
    title: "Skinny Fit Jeans",
    brand: "Levi's",
    price: 68.99,
    originalPrice: 79.99,
    images: ["/products/jeans-1.jpg", "/products/jeans-2.jpg"],
    category: "Jeans",
    slug: "skinny-fit-jeans",
    sizes: ["28", "30", "32", "34", "36"],
    colors: [
      { name: "Gray", value: "#1F2937" },
      { name: "Black", value: "#000000" },
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
    title: "Casual Summer Dress",
    brand: "Mango",
    price: 55.99,
    originalPrice: 55.99,
    images: ["/products/dress-1.jpg", "/products/dress-2.jpg"],
    category: "Dresses",
    slug: "casual-summer-dress",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Pink", value: "#EC4899" },
      { name: "White", value: "#FFFFFF" },
      { name: "Amber", value: "#F59E0B" },
    ],
    inStock: true,
    stockQuantity: 6,
    isNew: true,
    rating: 4.4,
    reviewCount: 95,
    sku: "MANGO-DRESS-005",
  },
  {
    id: "6",
    title: "Sports Performance Tee",
    brand: "Nike",
    price: 35.99,
    originalPrice: 45.99,
    images: ["/products/tshirt-1.jpg", "/products/tshirt-2.jpg"],
    category: "T-Shirts",
    slug: "sports-performance-tee",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "White", value: "#FFFFFF" },
      { name: "Red", value: "#DC2626" },
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
    title: "Formal Blazer",
    brand: "Hugo Boss",
    price: 199.99,
    originalPrice: 199.99,
    images: ["/products/blazer-1.jpg", "/products/blazer-2.jpg"],
    category: "Blazers",
    slug: "formal-blazer",
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#374151" },
    ],
    inStock: true,
    stockQuantity: 5,
    isNew: true,
    rating: 4.9,
    reviewCount: 42,
    sku: "HB-BLAZER-007",
  },
  {
    id: "8",
    title: "Casual Sneakers",
    brand: "Adidas",
    price: 89.99,
    originalPrice: 109.99,
    images: ["/products/sneakers-1.jpg", "/products/sneakers-2.jpg"],
    category: "Footwear",
    slug: "casual-sneakers",
    sizes: ["7", "8", "9", "10", "11"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 14,
    isNew: true,
    isTrending: true,
    discount: 18,
    rating: 4.5,
    reviewCount: 178,
    sku: "ADIDAS-SNK-008",
  },
];

const newArrivals: Product[] = rawProducts.map((p) => {
  // Create variants from sizes and colors
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
    }))
  );

  // Create assets
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


// Filter Tabs Component
const FilterTabs: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All New" },
    { id: "trending", label: "Trending" },
    { id: "bestsellers", label: "Bestsellers" },
    { id: "discount", label: "On Sale" },
    { id: "low-stock", label: "Almost Gone" },
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-1 pb-4">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            onClick={() => onFilterChange(filter.id)}
            className={`rounded-full px-6 ${activeFilter === filter.id
              ? "bg-black text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = newArrivals.filter((product) => {
    switch (activeFilter) {
      case "trending":
        return product.isTrending;
      case "bestsellers":
        return product.isBestSeller;
      case "discount":
        return product.variants.some((v) => (v.discount || 0) > 0);
      case "low-stock":
        const totalStock = product.variants.reduce(
          (acc, v) => acc + v.stockQuantity,
          0
        );
        return totalStock < 10;
      default:
        return true;
    }
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto ">
        {/* Section Header - Zara Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1 text-sm font-semibold border-gray-300"
          >
            JUST ARRIVED
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the latest styles fresh off the runway. Be the first to
            shop our newest collection.
          </p>
        </motion.div>

        {/* Filter Tabs - Myntra Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </motion.div>

        {/* Products Grid using unified ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button - H&M Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl"
          >
            <Link href="/new-arrivals">
              View All New Arrivals
              <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
