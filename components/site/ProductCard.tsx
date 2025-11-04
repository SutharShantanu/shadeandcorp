"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Zap, Eye, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NumberField } from "../ui/number-input";

export type Product = {
  id: string;
  title: string;
  description?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subCategory?: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  inStock: boolean;
  stockQuantity: number;
  isNew: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  sku: string;
  slug: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
};

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onAddToCart?: (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  variant = "default",
  className = "",
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.value || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Handle image hover for multiple images
  const handleImageHover = () => {
    setIsImageHovered(true);
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setIsImageHovered(false);
    setCurrentImageIndex(0);
  };

  // Quantity handler
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  // Action handlers
  const handleAddToCart = () => {
    onAddToCart?.(product, quantity, selectedSize, selectedColor);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  const handleBuyNow = () => {
    // Implement buy now logic
    handleAddToCart();
    // Redirect to checkout or show cart sidebar
  };

  // Calculate savings
  const savings = product.originalPrice
    ? product.originalPrice - product.price
    : 0;
  const discountPercentage =
    product.discount ||
    (product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0);

  // Stock status
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity < 10;
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  // Compact variant for space-constrained layouts
  if (variant === "compact") {
    return (
      <TooltipProvider>
        <div
          className={`group relative bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 ${className}`}
        >
          <Link href={`/products/${product.slug}`} className="block">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && (
                  <Badge className="bg-green-500 text-white border-0 text-xs px-2">
                    NEW
                  </Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-red-500 text-white border-0 text-xs px-2">
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white mb-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToWishlist();
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isWishlisted ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">
                {product.title}
              </h3>

              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>
            </div>
          </Link>

          {/* Add to Cart Button */}
          <div className="px-3 pb-3">
            <Button
              size="sm"
              className="w-full"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Default detailed variant
  return (
    <TooltipProvider>
      <div
        className={`group relative bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-500 ${className}`}
      >
        <Link href={`/products/${product.slug}`} className="block">
          {/* Image Container */}
          <div
            className="relative aspect-3/4 overflow-hidden rounded-t-xl cursor-pointer"
            onMouseEnter={handleImageHover}
            onMouseLeave={handleImageLeave}
          >
            <Image
              src={product.images[currentImageIndex]}
              alt={product.title}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  NEW
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  BESTSELLER
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 px-3 py-1 text-xs font-bold">
                  FEATURED
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWishlist();
                    }}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  </p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickView();
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick View</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Product</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Stock Status */}
            {isLowStock && (
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 border-0 text-xs"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Only {product.stockQuantity} left
                </Badge>
              </div>
            )}

            {isOutOfStock && (
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700 border-0 text-xs"
                >
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Size Quick View */}
            {isImageHovered && product.sizes.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex justify-center gap-1">
                  {product.sizes.slice(0, 5).map((size) => (
                    <div
                      key={size}
                      className={`bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded min-w-8 text-center transition-all ${
                        selectedSize === size
                          ? "border-2 border-black"
                          : "border border-transparent"
                      }`}
                    >
                      {size}
                    </div>
                  ))}
                  {product.sizes.length > 5 && (
                    <div className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
                      +{product.sizes.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand and Rating */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-600">
              {product.brand}
            </p>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors cursor-pointer">
              {product.title}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 font-medium">
                You save ${savings.toFixed(2)}
              </p>
            )}
          </div>

          {/* Color Options */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Colors:</span>
              <div className="flex gap-1">
                {product.colors.map((color, index) => (
                  <button
                    key={color.value}
                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Size:</span>
                <span className="text-xs text-gray-500">{selectedSize}</span>
              </div>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity Selector - Updated with NumberField */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quantity:</span>
            <div className="flex items-center gap-2">
              <NumberField
                value={quantity}
                onValueChange={handleQuantityChange}
                min={1}
                max={isOutOfStock ? 1 : product.stockQuantity}
                step={1}
                className="w-20"
                size="xs"
                disabled={isOutOfStock}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>SKU: {product.sku}</span>
              {product.tags && product.tags.length > 0 && (
                <span>Tags: {product.tags.slice(0, 2).join(", ")}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
