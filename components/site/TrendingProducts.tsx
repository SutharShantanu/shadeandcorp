"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCarousel from "./ProductCarousel";
import { Product } from "@/types/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import NumberFlow from "@number-flow/react";
import { Zap, Clock, TrendingUp, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionCtaButton from "@/components/site/SectionCtaButton";

// Enhanced product data matching our new Product type
const rawTrendingProducts = [
  {
    id: "1",
    title: "Premium Winter Parka Jacket",
    brand: "The North Face",
    price: 129.99,
    originalPrice: 199.99,
    discount: 35,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=600&fit=crop",
    ],
    category: "Winter Wear",
    subCategory: "Jackets",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Navy Blue", value: "#1E3A8A" },
      { name: "Forest Green", value: "#166534" },
    ],
    inStock: true,
    stockQuantity: 8,
    isNew: true,
    isTrending: true,
    isOnSale: true,
    rating: 4.8,
    reviewCount: 156,
    tags: ["winter", "waterproof", "insulated"],
    sku: "TNF-WPJ-001",
    slug: "premium-winter-parka-jacket",
    description:
      "Premium waterproof winter parka with thermal insulation, perfect for extreme cold conditions.",
  },
  {
    id: "2",
    title: "Designer Festival Maxi Dress",
    brand: "Free People",
    price: 89.99,
    originalPrice: 120.0,
    discount: 25,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop",
    ],
    category: "Dresses",
    subCategory: "Maxi Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Floral Print", value: "#FEF3C7" },
      { name: "Bohemian Blue", value: "#60A5FA" },
      { name: "Sunset Pink", value: "#FDA4AF" },
    ],
    inStock: true,
    stockQuantity: 12,
    isNew: true,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 89,
    tags: ["festival", "boho", "maxi"],
    sku: "FP-FMD-002",
    slug: "designer-festival-maxi-dress",
    description:
      "Beautiful bohemian-style maxi dress perfect for festivals and summer events.",
  },
  {
    id: "3",
    title: "Limited Edition Sneakers",
    brand: "Nike",
    price: 179.99,
    originalPrice: 220.0,
    discount: 18,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=600&fit=crop",
    ],
    category: "Footwear",
    subCategory: "Sneakers",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "White/Red", value: "#FFFFFF" },
      { name: "Black/Gold", value: "#000000" },
      { name: "Limited Edition", value: "#7C3AED" },
    ],
    inStock: true,
    stockQuantity: 5,
    isNew: true,
    isTrending: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 234,
    tags: ["limited", "sneakers", "collector"],
    sku: "NIKE-LE-003",
    slug: "limited-edition-sneakers",
    description:
      "Limited edition collaboration sneakers with premium materials and exclusive design.",
  },
  {
    id: "4",
    title: "Luxury Winter Cashmere Sweater",
    brand: "Brunello Cucinelli",
    price: 299.99,
    originalPrice: 450.0,
    discount: 33,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=500&h=600&fit=crop",
    ],
    category: "Winter Wear",
    subCategory: "Sweaters",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cream", value: "#FEF3C7" },
      { name: "Charcoal", value: "#374151" },
      { name: "Burgundy", value: "#991B1B" },
    ],
    inStock: true,
    stockQuantity: 3,
    isNew: true,
    isOnSale: true,
    rating: 4.7,
    reviewCount: 67,
    tags: ["luxury", "cashmere", "premium"],
    sku: "BC-CSW-004",
    slug: "luxury-winter-cashmere-sweater",
    description:
      "100% premium cashmere sweater for ultimate comfort and warmth during winter.",
  },
  {
    id: "5",
    title: "Festival Accessories Kit",
    brand: "H&M Collaboration",
    price: 45.99,
    originalPrice: 65.0,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=500&h=600&fit=crop",
    ],
    category: "Accessories",
    subCategory: "Jewelry",
    sizes: ["Default"],
    colors: [
      { name: "Rainbow Set", value: "#F59E0B" },
      { name: "Silver Collection", value: "#D1D5DB" },
      { name: "Gold Package", value: "#FBBF24" },
    ],
    inStock: true,
    stockQuantity: 25,
    isNew: true,
    isFeatured: true,
    rating: 4.4,
    reviewCount: 128,
    tags: ["festival", "accessories", "set"],
    sku: "HM-FAK-005",
    slug: "festival-accessories-kit",
    description:
      "Complete festival accessories kit including jewelry, hats, and essential items.",
  },
  {
    id: "6",
    title: "Smart Winter Tech Gloves",
    brand: "The North Face",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&h=600&fit=crop",
    ],
    category: "Winter Wear",
    subCategory: "Accessories",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#6B7280" },
      { name: "Navy", value: "#1E40AF" },
    ],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isTrending: true,
    rating: 4.5,
    reviewCount: 92,
    tags: ["tech", "touchscreen", "winter"],
    sku: "TNF-TG-006",
    slug: "smart-winter-tech-gloves",
    description:
      "Touchscreen-compatible winter gloves with thermal insulation and waterproof technology.",
  },
  {
    id: "7",
    title: "Designer Holiday Party Dress",
    brand: "Reformation",
    price: 158.99,
    originalPrice: 220.0,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop",
    ],
    category: "Dresses",
    subCategory: "Party Dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Emerald Green", value: "#047857" },
      { name: "Velvet Red", value: "#DC2626" },
      { name: "Midnight Black", value: "#000000" },
    ],
    inStock: true,
    stockQuantity: 7,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 203,
    tags: ["holiday", "party", "evening"],
    sku: "REF-HPD-007",
    slug: "designer-holiday-party-dress",
    description:
      "Elegant holiday party dress with sophisticated design perfect for special occasions.",
  },
  {
    id: "8",
    title: "Winter Boots Collection",
    brand: "UGG",
    price: 149.99,
    originalPrice: 189.99,
    discount: 21,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop",
    ],
    category: "Footwear",
    subCategory: "Boots",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [
      { name: "Chestnut", value: "#92400E" },
      { name: "Black", value: "#000000" },
      { name: "Sand", value: "#D97706" },
    ],
    inStock: true,
    stockQuantity: 18,
    isNew: true,
    isOnSale: true,
    rating: 4.6,
    reviewCount: 312,
    tags: ["winter", "boots", "comfort"],
    sku: "UGG-WBC-008",
    slug: "winter-boots-collection",
    description:
      "Comfortable and warm winter boots with premium materials and superior insulation.",
  },
];

const trendingProducts: Product[] = rawTrendingProducts.map((p) => {
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
    })),
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
  } as Product;
});

const CountdownTimer = ({ endDate }: { endDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex gap-4 text-center">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="bg-linear-to-br from-red-500 to-pink-600 text-white rounded-lg p-3 min-w-[70px] shadow-lg">
            <NumberFlow
              className="text-2xl font-bold font-mono"
              value={item.value}
            />
          </div>
          <span className="text-sm text-muted-foreground mt-2 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) => {
  const categories = [
    {
      id: "all",
      label: "All Products",
      icon: <Zap className="w-4 h-4" />,
      count: trendingProducts.length,
    },
    {
      id: "trending",
      label: "Trending",
      icon: <TrendingUp className="w-4 h-4" />,
      count: trendingProducts.filter((p) => p.isTrending).length,
    },
    {
      id: "sale",
      label: "On Sale",
      icon: <Star className="w-4 h-4" />,
      count: trendingProducts.filter((p) => p.isOnSale).length,
    },
    {
      id: "Winter Wear",
      label: "Winter",
      icon: <span>❄️</span>,
      count: trendingProducts.filter((p) => p.category === "Winter Wear")
        .length,
    },
    {
      id: "Dresses",
      label: "Festival",
      icon: <span>🎪</span>,
      count: trendingProducts.filter(
        (p) => p.category === "Dresses" || p.tags?.includes("festival"),
      ).length,
    },
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-4 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="rounded-full px-5 py-2.5 h-auto transition-all duration-300 cursor-pointer shadow-2xs"
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
            <Badge
              variant={selectedCategory === category.id ? "secondary" : "outline"}
              className="ml-2 text-xs"
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default function TrendingProducts() {
  // Set sale end date to 7 days from now
  const saleEndDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts =
    selectedCategory === "all"
      ? trendingProducts
      : selectedCategory === "trending"
        ? trendingProducts.filter((product) => product.isTrending)
        : selectedCategory === "sale"
          ? trendingProducts.filter((product) => product.isOnSale)
          : trendingProducts.filter(
              (product) =>
                product.category === selectedCategory ||
                product.tags?.includes(selectedCategory.toLowerCase()),
            );

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge
            variant="destructive"
            className="mb-4 px-4 py-1 text-xs font-semibold uppercase tracking-wider"
          >
            LIMITED TIME OFFER
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Special Offers & Collections
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover our exclusive collections with limited-time discounts.
            Don&apos;t miss out on these amazing deals!
          </p>

          {/* Countdown Timer */}
          <div className="flex flex-col items-center gap-4 bg-card rounded-2xl p-6 shadow-md border border-border max-w-md mx-auto">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>Sale Ends In:</span>
            </div>
            <CountdownTimer endDate={saleEndDate} />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Products Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <ProductCarousel
            products={filteredProducts}
            title="Special Offers & Trending Items"
            subtitle="Swipe through our curated high-demand items with exclusive discounts"
            badgeText="Featured Deals"
            autoplay={true}
            autoplayDelay={4000}
          />
        </motion.div>

        {/* View All Button */}
        <SectionCtaButton
          href="/products"
          variant="outline"
          delay={0.6}
        >
          View All Special Offers
        </SectionCtaButton>
      </div>
    </section>
  );
}
