"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Zap,
  Eye,
  Share2,
  AlertCircle,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import QuickCheckoutModal from "../modal/QuickCheckoutModal";
import {
  ActionButtonsProps,
  AdditionalInfoProps,
  ColorOptionsProps,
  CompactProductCardProps,
  PriceSectionProps,
  Product,
  ProductCardProps,
  ProductImageSectionProps,
  ProductInfoHeaderProps,
  QuickActionButtonsProps,
  SizeSelectorProps,
} from "@/types/ProductCard";

// ==================== COMPONENT: SizeSelectionPopover ====================
interface SizeSelectionPopoverProps {
  product: Product;
  selectedSize: string;
  sizeError: string;
  onSizeSelect: (size: string) => void;
  isSizeAvailable: (size: string) => boolean;
  onClose: () => void;
  onConfirm: (action: 'addToBag' | 'buyNow') => void;
  open: boolean;
}

function SizeSelectionPopover({
  product,
  selectedSize,
  sizeError,
  onSizeSelect,
  isSizeAvailable,
  onClose,
  onConfirm,
  open,
}: SizeSelectionPopoverProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full animate-in fade-in-90 zoom-in-90">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Select Size</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SizeSelector
          product={product}
          selectedSize={selectedSize}
          sizeError={sizeError}
          onSizeSelect={onSizeSelect}
          isSizeAvailable={isSizeAvailable}
        />

        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1"
            onClick={() => onConfirm('addToBag')}
            disabled={!selectedSize}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Bag
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onConfirm('buyNow')}
            disabled={!selectedSize}
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENT: ProductImageSection ====================

function ProductImageSection({
  product,
  currentImageIndex,
  isWishlisted,
  isOutOfStock,
  discountPercentage,
  onImageHover,
  onImageLeave,
  onAddToWishlist,
  onQuickView,
}: ProductImageSectionProps) {
  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div
        className="relative aspect-square overflow-hidden rounded-t-xl cursor-pointer"
        onMouseEnter={onImageHover}
        onMouseLeave={onImageLeave}
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
        <ProductBadges
          product={product}
          discountPercentage={discountPercentage}
        />

        {/* Quick Actions */}
        <QuickActionButtons
          isWishlisted={isWishlisted}
          onAddToWishlist={onAddToWishlist}
          onQuickView={onQuickView}
        />

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
      </div>
    </Link>
  );
}

// ==================== COMPONENT: ProductBadges ====================
interface ProductBadgesProps {
  product: Product;
  discountPercentage: number;
}

function ProductBadges({ product, discountPercentage }: ProductBadgesProps) {
  return (
    <div className="absolute top-3 left-3 flex flex-col gap-2">
      {product.isNew && (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0 text-xs uppercase font-semibold py-1">
          New
        </Badge>
      )}
      {product.isBestSeller && (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 border-0 text-xs uppercase font-semibold py-1">
          Bestseller
        </Badge>
      )}
      {discountPercentage > 0 && (
        <Badge className="bg-red-500 hover:bg-red-600 border-0 text-xs uppercase font-semibold py-1">
          -{discountPercentage}%
        </Badge>
      )}
      {product.isFeatured && (
        <Badge className="bg-purple-500 hover:bg-purple-600 border-0 text-xs uppercase font-semibold py-1">
          Featured
        </Badge>
      )}
    </div>
  );
}

// ==================== COMPONENT: QuickActionButtons ====================

function QuickActionButtons({
  isWishlisted,
  onAddToWishlist,
  onQuickView,
}: QuickActionButtonsProps) {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full backdrop-blur-sm p-0"
            onClick={(e) => {
              e.preventDefault();
              onAddToWishlist();
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full backdrop-blur-sm p-0"
            onClick={(e) => {
              e.preventDefault();
              onQuickView();
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Quick View</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full backdrop-blur-sm p-0"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Share</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// ==================== COMPONENT: ProductInfoHeader ====================

function ProductInfoHeader({ product }: ProductInfoHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-gray-600">{product.brand}</p>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{product.rating}</span>
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
      </div>
    </div>
  );
}

// ==================== COMPONENT: PriceSection ====================

function PriceSection({ product, savings }: PriceSectionProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold ">
          ${product.price}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice}
          </span>
        )}
        {savings > 0 && (
          <p className="text-xs text-green-600 font-medium">
            You save ${savings.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

// ==================== COMPONENT: ColorOptions ====================

const ColorOptions = ({
  product,
  selectedColor,
  onColorSelect,
}: ColorOptionsProps) => {
  if (product.colors.length === 0) return null;

  return (
    <RadioGroup
      value={selectedColor}
      onValueChange={onColorSelect}
      className="flex gap-2 items-center"
    >
      <span className="text-xs font-medium ">Color</span>
      {product.colors.length > 0 && (
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <RadioGroupItem
              key={color.value}
              value={color.value}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >            
            </RadioGroupItem>
          ))}
        </div>
      )}
    </RadioGroup>
  );
};

// ==================== COMPONENT: SizeSelector ====================

function SizeSelector({
  product,
  selectedSize,
  sizeError,
  onSizeSelect,
  isSizeAvailable,
}: SizeSelectorProps) {
  if (product.sizes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium ">SELECT SIZE</span>
        {selectedSize && (
          <span className="text-xs text-gray-500">{selectedSize}</span>
        )}
      </div>
      <RadioGroup
        value={selectedSize}
        onValueChange={onSizeSelect}
        className="flex flex-wrap gap-2"
      >
        {product.sizes.map((size) => {
          const available = isSizeAvailable(size);
          return (
            <div key={size} className="relative">
              <RadioGroupItem
                value={size}
                id={`size-${product.id}-${size}`}
                disabled={!available}
                className="sr-only"
              />
              <Label
                htmlFor={`size-${product.id}-${size}`}
                className={`
                  relative flex items-center justify-center w-8 h-8 text-xs font-medium border rounded-full cursor-pointer transition-all
                  ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : available
                      ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
                title={available ? `Select ${size}` : `${size} - Out of Stock`}
              >
                {size}
                {/* Cross line for unavailable sizes */}
                {!available && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-gray-400 transform rotate-45 rounded-full" />
                  </div>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {/* Size Error Message */}
      {sizeError && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{sizeError}</span>
        </div>
      )}
    </div>
  );
}

// ==================== COMPONENT: ActionButtons ====================

function ActionButtons({
  isOutOfStock,
  onAddToCart,
  onBuyNow,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 items-center">
      <Button
        className="flex-1"
        size="sm"
        disabled={isOutOfStock}
        onClick={onAddToCart}
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Bag
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        size="sm"
        disabled={isOutOfStock}
        onClick={onBuyNow}
      >
        <Zap className="w-4 h-4" />
        Buy Now
      </Button>
    </div>
  );
}

// ==================== COMPONENT: AdditionalInfo ====================

function AdditionalInfo({ product }: AdditionalInfoProps) {
  return (
    <div className="pt-2 border-t border-gray-100">
      <div className="flex justify-between text-xs text-gray-500">
        <span>SKU: {product.sku}</span>
        {product.tags && product.tags.length > 0 && (
          <span>Tags: {product.tags.slice(0, 2).join(", ")}</span>
        )}
      </div>
    </div>
  );
}

// ==================== COMPONENT: CompactProductCard ====================

function CompactProductCard({
  product,
  className,
  isWishlisted,
  isOutOfStock,
  discountPercentage,
  onAddToWishlistClick,
  onAddToCartClick,
  showCheckoutModal,
  setShowCheckoutModal,
  selectedSize,
  selectedColor,
}: CompactProductCardProps) {
  return (
    <TooltipProvider>
      <div className={`group relative rounded-lg transition-all ${className}`}>
        <Link href={`/products/${product.slug}`} className="block">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-all ease-in-out group-hover:scale-105"
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
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white mb-1"
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToWishlistClick();
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
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3">
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
            <h3 className="font-medium text-sm  line-clamp-2 mb-2">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold ">${product.price}</span>
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
            onClick={onAddToCartClick}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {/* Quick Checkout Modal */}
        <QuickCheckoutModal
          open={showCheckoutModal}
          onOpenChange={setShowCheckoutModal}
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={1}
        />
      </div>
    </TooltipProvider>
  );
}

// ==================== MAIN PRODUCT CARD COMPONENT ====================
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSizePopover, setShowSizePopover] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [pendingAction, setPendingAction] = useState<'addToBag' | 'buyNow' | null>(null);

  // Check if a size is available
  const isSizeAvailable = (size: string) => {
    if (product.sizeAvailability) {
      return product.sizeAvailability[size] !== false;
    }
    return true;
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
      setSizeError("");
    }
  };

  // Handle image hover for multiple images
  const handleImageHover = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  // Action handlers - now they open the popover first
  const handleAddToCart = () => {
    setPendingAction('addToBag');
    setShowSizePopover(true);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);

    if (isWishlisted) {
      toast.info(`${product.title} has been removed from your wishlist.`);
    } else {
      toast.success(`${product.title} has been added to your wishlist.`);
    }
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  const handleBuyNow = () => {
    setPendingAction('buyNow');
    setShowSizePopover(true);
  };

  // Handle size selection confirmation
  const handleSizeConfirm = (action: 'addToBag' | 'buyNow') => {
    if (!selectedSize) {
      setSizeError("Please select a size to continue");
      return;
    }

    if (action === 'addToBag') {
      onAddToCart?.(product, 1, selectedSize, selectedColor);
      toast.success(
        `${product.title} (Size: ${selectedSize}) has been added to your bag.`
      );
      setShowSizePopover(false);
      setPendingAction(null);
    } else if (action === 'buyNow') {
      setShowSizePopover(false);
      setPendingAction(null);
      setShowCheckoutModal(true);
    }
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
  const isOutOfStock = !product.inStock || product.stockQuantity === 0;

  // Compact variant for space-constrained layouts
  if (variant === "compact") {
    return (
      <CompactProductCard
        product={product}
        className={className}
        isWishlisted={isWishlisted}
        isOutOfStock={isOutOfStock}
        discountPercentage={discountPercentage}
        onAddToWishlistClick={handleAddToWishlist}
        onAddToCartClick={handleAddToCart}
        showCheckoutModal={showCheckoutModal}
        setShowCheckoutModal={setShowCheckoutModal}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    );
  }

  // Default detailed variant
  return (
    <TooltipProvider>
      <div
        className={`group relative bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-500 ${className}`}
      >
        <ProductImageSection
          product={product}
          currentImageIndex={currentImageIndex}
          isWishlisted={isWishlisted}
          isOutOfStock={isOutOfStock}
          discountPercentage={discountPercentage}
          onImageHover={handleImageHover}
          onImageLeave={handleImageLeave}
          onAddToWishlist={handleAddToWishlist}
          onQuickView={handleQuickView}
        />

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <ProductInfoHeader product={product} />

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold  line-clamp-2 group-hover:text-black transition-colors cursor-pointer">
              {product.title}
            </h3>
          </Link>

          <PriceSection product={product} savings={savings} />

          <ColorOptions
            product={product}
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />

          {/* Size selector is now hidden and only shown in popover */}

          <ActionButtons
            isOutOfStock={isOutOfStock}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          <AdditionalInfo product={product} />
        </div>

        {/* Size Selection Popover */}
        <SizeSelectionPopover
          product={product}
          selectedSize={selectedSize}
          sizeError={sizeError}
          onSizeSelect={handleSizeSelect}
          isSizeAvailable={isSizeAvailable}
          onClose={() => {
            setShowSizePopover(false);
            setPendingAction(null);
          }}
          onConfirm={handleSizeConfirm}
          open={showSizePopover}
        />

        {/* Quick Checkout Modal */}
        <QuickCheckoutModal
          open={showCheckoutModal}
          onOpenChange={setShowCheckoutModal}
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={1}
        />
      </div>
    </TooltipProvider>
  );
}