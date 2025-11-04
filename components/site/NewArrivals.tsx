"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Heart, Eye, Zap } from "lucide-react";

type ProductType = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  isNew: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
};

const newArrivals: ProductType[] = [
  {
    id: "1",
    name: "Slim Fit Cotton Shirt",
    brand: "Zara",
    price: 45.99,
    originalPrice: 59.99,
    image: "/products/shirt-1.jpg",
    images: ["/products/shirt-1.jpg", "/products/shirt-2.jpg"],
    category: "Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#374151", "#DC2626"],
    isNew: true,
    isTrending: true,
    discount: 23,
    rating: 4.5,
    reviewCount: 128,
    stock: 15
  },
  {
    id: "2",
    name: "Designer Denim Jacket",
    brand: "H&M",
    price: 89.99,
    originalPrice: 119.99,
    image: "/products/jacket-1.jpg",
    images: ["/products/jacket-1.jpg", "/products/jacket-2.jpg"],
    category: "Jackets",
    sizes: ["M", "L", "XL"],
    colors: ["#1E40AF", "#000000"],
    isNew: true,
    isBestSeller: true,
    discount: 25,
    rating: 4.8,
    reviewCount: 89,
    stock: 8
  },
  {
    id: "3",
    name: "Premium Wool Sweater",
    brand: "Massimo Dutti",
    price: 75.50,
    image: "/products/sweater-1.jpg",
    images: ["/products/sweater-1.jpg", "/products/sweater-2.jpg"],
    category: "Sweaters",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#F59E0B", "#EF4444", "#000000"],
    isNew: true,
    rating: 4.3,
    reviewCount: 64,
    stock: 12
  },
  {
    id: "4",
    name: "Skinny Fit Jeans",
    brand: "Levi's",
    price: 68.99,
    originalPrice: 79.99,
    image: "/products/jeans-1.jpg",
    images: ["/products/jeans-1.jpg", "/products/jeans-2.jpg"],
    category: "Jeans",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["#1F2937", "#000000"],
    isNew: true,
    isTrending: true,
    discount: 14,
    rating: 4.6,
    reviewCount: 203,
    stock: 20
  },
  {
    id: "5",
    name: "Casual Summer Dress",
    brand: "Mango",
    price: 55.99,
    image: "/products/dress-1.jpg",
    images: ["/products/dress-1.jpg", "/products/dress-2.jpg"],
    category: "Dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["#EC4899", "#FFFFFF", "#F59E0B"],
    isNew: true,
    rating: 4.4,
    reviewCount: 95,
    stock: 6
  },
  {
    id: "6",
    name: "Sports Performance Tee",
    brand: "Nike",
    price: 35.99,
    originalPrice: 45.99,
    image: "/products/tshirt-1.jpg",
    images: ["/products/tshirt-1.jpg", "/products/tshirt-2.jpg"],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000000", "#FFFFFF", "#DC2626"],
    isNew: true,
    isBestSeller: true,
    discount: 22,
    rating: 4.7,
    reviewCount: 156,
    stock: 25
  },
  {
    id: "7",
    name: "Formal Blazer",
    brand: "Hugo Boss",
    price: 199.99,
    image: "/products/blazer-1.jpg",
    images: ["/products/blazer-1.jpg", "/products/blazer-2.jpg"],
    category: "Blazers",
    sizes: ["38", "40", "42", "44"],
    colors: ["#000000", "#374151"],
    isNew: true,
    rating: 4.9,
    reviewCount: 42,
    stock: 5
  },
  {
    id: "8",
    name: "Casual Sneakers",
    brand: "Adidas",
    price: 89.99,
    originalPrice: 109.99,
    image: "/products/sneakers-1.jpg",
    images: ["/products/sneakers-1.jpg", "/products/sneakers-2.jpg"],
    category: "Footwear",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["#FFFFFF", "#000000"],
    isNew: true,
    isTrending: true,
    discount: 18,
    rating: 4.5,
    reviewCount: 178,
    stock: 14
  }
];

const ProductCard: React.FC<{ product: ProductType; index: number }> = ({ 
  product, 
  index 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageHover = () => {
    setIsHovered(true);
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl bg-white">
        <div 
          className="relative aspect-3/4 overflow-hidden cursor-pointer"
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        >
          {/* Product Image */}
          <Image
            src={product.images[currentImageIndex] || product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 text-xs font-bold">
                NEW
              </Badge>
            )}
            {product.discount && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 text-xs font-bold">
                -{product.discount}%
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 px-3 py-1 text-xs font-bold">
                BESTSELLER
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Size Quick View - Myntra Style */}
          {isHovered && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex justify-center gap-1">
                {product.sizes.slice(0, 4).map((size) => (
                  <div
                    key={size}
                    className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded min-w-8 text-center"
                  >
                    {size}
                  </div>
                ))}
                {product.sizes.length > 4 && (
                  <div className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
                    +{product.sizes.length - 4}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button - H&M Style */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Button className="w-full bg-black text-white hover:bg-gray-800 font-semibold rounded-lg py-3">
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Brand */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">{product.brand}</p>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount})</span>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Color Options */}
            <div className="flex gap-1">
              {product.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Stock Status */}
            {product.stock < 10 && (
              <p className="text-xs text-orange-600 font-medium">
                Only {product.stock} left!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
    { id: "low-stock", label: "Almost Gone" }
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-1 pb-4">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            onClick={() => onFilterChange(filter.id)}
            className={`rounded-full px-6 ${
              activeFilter === filter.id 
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
        return product.discount;
      case "low-stock":
        return product.stock < 10;
      default:
        return true;
    }
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Zara Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm font-semibold border-gray-300">
            JUST ARRIVED
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the latest styles fresh off the runway. Be the first to shop our newest collection.
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
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
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