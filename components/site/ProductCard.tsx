"use client";

import React, { useState } from "react";
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
  Ruler,
  ArrowRight,
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
  PriceSectionProps,
  Product,
  ProductCardProps,
  ProductImageSectionProps,
  ProductInfoHeaderProps,
  QuickActionButtonsProps,
  SizeSelectorProps,
} from "@/types/ProductCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { SizeChart } from "@/components/ui/size-chart";

// ==================== COMPONENT: SizeSelectionModal ====================
interface SizeSelectionModalProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  sizeError: string;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  isSizeAvailable: (size: string) => boolean;
  onClose: () => void;
  onProceed: (action: "addToBag" | "buyNow") => void;
  open: boolean;
  pendingAction: "addToBag" | "buyNow" | null;
  onOpenSizeChart: () => void;
}

function SizeSelectionModal({
  product,
  selectedSize,
  selectedColor,
  sizeError,
  onSizeSelect,
  onColorSelect,
  isSizeAvailable,
  onClose,
  onProceed,
  open,
  pendingAction,
  onOpenSizeChart,
}: SizeSelectionModalProps) {
  const selectedColorObj = product.colors.find(
    (color) => color.value === selectedColor
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Configure Your Product
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Product Compact Info */}
          <div className="flex gap-6 mb-8">
            {/* Product Image */}
            <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden border">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.isNew && (
                  <Badge className="bg-emerald-500 text-white border-0 text-xs">
                    New
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Color</span>
              {selectedColorObj && (
                <span className="text-sm">
                  Selected: {selectedColorObj.name}
                </span>
              )}
            </div>
            <RadioGroup
              value={selectedColor}
              onValueChange={onColorSelect}
              className="flex gap-2 items-center"
            >
              {product?.colors && product.colors.length > 0 && (
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <RadioGroupItem
                      key={color.value}
                      value={color.value}
                      id={`color-${product.id}-${color.value}`}
                      aria-label={color.name}
                      className="h-10 w-10 cursor-pointer"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </RadioGroup>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Size</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-blue-600 hover:text-blue-700"
                  onClick={onOpenSizeChart}
                >
                  <Ruler className="w-4 h-4 mr-1" />
                  Size Guide
                </Button>
              </div>

              <SizeSelector
                product={product}
                selectedSize={selectedSize}
                sizeError={sizeError}
                onSizeSelect={onSizeSelect}
                isSizeAvailable={isSizeAvailable}
              />
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free shipping on orders over $50</li>
                <li>• 30-day return policy</li>
                <li>• 1-year warranty included</li>
                {product.tags && product.tags.length > 0 && (
                  <li>• Tags: {product.tags.slice(0, 3).join(", ")}</li>
                )}
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              <Button
                className="flex-1 h-12 text-base font-medium"
                onClick={() => pendingAction && onProceed(pendingAction)}
                disabled={!selectedSize || !pendingAction}
                size="lg"
              >
                {pendingAction === "addToBag" ? (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-1" />
                    Add to Bag
                  </>
                ) : pendingAction === "buyNow" ? (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                ) : (
                  <>Confirm</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
              className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""
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
        <span className="text-xl font-bold ">${product.price}</span>
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
            />
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
                  ${selectedSize === size
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

// ==================== MAIN PRODUCT CARD COMPONENT ====================
export default function ProductCard({
  product,
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
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "addToBag" | "buyNow" | null
  >(null);

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

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
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

  // Action handlers - now they open the modal first
  const handleAddToCart = () => {
    setPendingAction("addToBag");
    setShowSizeModal(true);
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
    setPendingAction("buyNow");
    setShowSizeModal(true);
  };

  // Handle size selection confirmation
  const handleProceed = (action: "addToBag" | "buyNow") => {
    if (!selectedSize) {
      setSizeError("Please select a size to continue");
      return;
    }

    if (action === "addToBag") {
      onAddToCart?.(product, 1, selectedSize, selectedColor);
      toast.success(
        `${product.title} (Size: ${selectedSize}) has been added to your bag.`
      );
      setShowSizeModal(false);
      setPendingAction(null);
      setShowCheckoutModal(true);
    } else if (action === "buyNow") {
      setShowSizeModal(false);
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
            onColorSelect={handleColorSelect}
          />

          {/* Size selector is now hidden and only shown in modal */}

          <ActionButtons
            isOutOfStock={isOutOfStock}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          <AdditionalInfo product={product} />
        </div>

        {/* Size Selection Modal */}
        <SizeSelectionModal
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          sizeError={sizeError}
          onSizeSelect={handleSizeSelect}
          onColorSelect={handleColorSelect}
          isSizeAvailable={isSizeAvailable}
          onClose={() => {
            setShowSizeModal(false);
            setPendingAction(null);
          }}
          onProceed={handleProceed}
          open={showSizeModal}
          pendingAction={pendingAction}
          onOpenSizeChart={() => setSizeChartOpen(true)}
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

        {/* Size Chart (no drawer) */}
        <SizeChartDrawer
          product={product}
          open={sizeChartOpen}
          onOpenChange={setSizeChartOpen}
        />
      </div>
    </TooltipProvider>
  );
}

// Local size chart dialog controlled by ProductCard state
function SizeChartDrawer({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <SizeChart brand={product.brand} category={product.category} />
      </DialogContent>
    </Dialog>
  );
}