"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Zap,
  Share2,
  AlertCircle,
  Star,
  Ruler,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { DotButton, useDotButton } from "../ui/embla-carousel-dot-button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  ActionButtonsProps,
  ColorOptionsProps,
  PriceSectionProps,
  Product,
  ProductCardProps,
  ProductImageSectionProps,
  ProductInfoHeaderProps,
  QuickActionButtonsProps,
  SizeSelectorProps,
  Variant,
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
  const selectedColorObj = product.variants.find(
    (v) => v.color.hex === selectedColor,
  )?.color;

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
                src={
                  product.assets.find((a) => a.role === "thumbnail")?.url ||
                  product.assets[0]?.url ||
                  "https://placehold.co/600x600/f0f0f0/333333/png?text=Placeholder"
                }
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
                <span className="text-lg font-bold">
                  $
                  {product.variants.find((v) => v.isDefault)?.price ||
                    product.basePrice}
                </span>
                {product.isNew && (
                  <Badge variant="default" color="success" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between">
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
              {product?.variants && product.variants.length > 0 && (
                <div className="flex gap-2">
                  {Array.from(
                    new Set(
                      product.variants.map((v) => JSON.stringify(v.color)),
                    ),
                  )
                    .map((s) => JSON.parse(s))
                    .map((color: Variant["color"]) => (
                      <RadioGroupItem
                        key={color.hex}
                        value={color.hex}
                        id={`color-${product.id}-${color.hex}`}
                        aria-label={color.name}
                        className="h-10 w-10 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                </div>
              )}
            </RadioGroup>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Size{" "}
                  {selectedSize && (
                    <span className="normal-case font-normal text-muted-foreground ml-1">
                      — {selectedSize}
                    </span>
                  )}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary hover:text-primary/80"
                  onClick={onOpenSizeChart}
                >
                  <Ruler className="size-2.5" />
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
            <div className="rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Product Details</h4>
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
  isWishlisted,
  isOutOfStock,
  discountPercentage,
  onAddToWishlist,
  selectedColorName,
}: ProductImageSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  const filteredAssets = useMemo(() => {
    return [...product.assets].sort((a, b) => a.order - b.order).slice(0, 4);
  }, [product.assets]);

  // Reset carousel to first slide when filtered images change
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [api, filteredAssets]);

  return (
    <motion.div
      layoutId={`product-image-${product.id}`}
      className="relative group"
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {filteredAssets.map((asset, index) => (
            <CarouselItem key={`${asset.url}-${index}`} className="pl-0">
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-square overflow-hidden cursor-pointer">
                  <Image
                    src={asset.url}
                    alt={asset.alt || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-all duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={index === 0}
                  />
                  {/* Base Gradient Overlay for readability - subtle */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots/Indicator */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
          <div className="flex gap-1.5 p-1 rounded-full">
            {filteredAssets.length > 1 &&
              filteredAssets.map((_, index) => (
                <DotButton
                  key={index}
                  selected={index === selectedIndex}
                  onClick={() => onDotButtonClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 border border-white/20 shadow-sm ${
                    index === selectedIndex
                      ? "bg-white scale-110"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
          </div>
        </div>
      </Carousel>

      <ProductBadges
        product={product}
        discountPercentage={discountPercentage}
      />

      {/* Quick Actions */}
      <QuickActionButtons
        isWishlisted={isWishlisted}
        onAddToWishlist={onAddToWishlist}
      />

      {isOutOfStock && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="text-xs">
            Out of Stock
          </Badge>
        </div>
      )}
    </motion.div>
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
        <Badge
          color="default"
          className="border-0 text-xs uppercase font-semibold py-1"
        >
          New
        </Badge>
      )}
      {product.isBestSeller && (
        <Badge
          color="warning"
          className="border-0 text-xs uppercase font-semibold py-1"
        >
          Bestseller
        </Badge>
      )}
      {discountPercentage > 0 && (
        <Badge
          color="danger"
          className="border-0 text-xs uppercase font-semibold py-1"
        >
          -{discountPercentage}%
        </Badge>
      )}
      {product.isFeatured && (
        <Badge
          color="info"
          className="border-0 text-xs uppercase font-semibold py-1"
        >
          Featured
        </Badge>
      )}
    </div>
  );
}

function QuickActionButtons({
  isWishlisted,
  onAddToWishlist,
}: QuickActionButtonsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full bg-transparent! shadow-none transition-all ease-in-out duration-300"
        onClick={(e) => {
          e.preventDefault();
          onAddToWishlist();
        }}
      >
        <Heart
          className={`transition-all ease-in-out duration-300 ${isWishlisted && "fill-red-400 text-red-400"}`}
        />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full bg-transparent! shadow-none transition-all ease-in-out duration-300"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ==================== COMPONENT: ProductInfoHeader ====================

function ProductInfoHeader({ product }: ProductInfoHeaderProps) {
  return (
    <motion.div
      layoutId={`product-info-${product.id}`}
      className="flex flex-col gap-1"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">
          {product.brand}
        </p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs">({product.reviewCount})</span>
        </div>
      </div>
      <Link href={`/product/${product.slug}`}>
        <h3 className="font-semibold line-clamp-2 transition-all ease-in-out cursor-pointer">
          {product.title}
        </h3>
      </Link>
    </motion.div>
  );
}

// ==================== COMPONENT: PriceSection ====================

function PriceSection({ product, savings }: PriceSectionProps) {
  return (
    <motion.div layoutId={`product-price-${product.id}`} className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold ">${product.basePrice}</span>
        {savings > 0 && (
          <p className="text-xs font-medium">You save ${savings.toFixed(2)}</p>
        )}
      </div>
    </motion.div>
  );
}

// ==================== COMPONENT: ColorOptions ====================

const ColorOptions = ({
  product,
  selectedColor,
  onColorSelect,
}: ColorOptionsProps) => {
  const colors = useMemo(() => {
    return Array.from(
      new Set(product.variants.map((v) => JSON.stringify(v.color))),
    ).map((s) => JSON.parse(s));
  }, [product.variants]);

  if (colors.length === 0) return null;

  return (
    <RadioGroup
      value={selectedColor}
      onValueChange={onColorSelect}
      className="flex gap-2 items-center"
    >
      <span className="text-xs font-medium ">Color</span>
      <div className="flex gap-2 items-center">
        {colors.slice(0, 3).map((color: Variant["color"]) => (
          <RadioGroupItem
            key={color.hex}
            value={color.hex}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
        {colors.length > 3 && (
          <span className="text-xs text-muted-foreground ml-1">
            +{colors.length - 3}
          </span>
        )}
      </div>
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
  const sizes = useMemo(() => {
    return Array.from(new Set(product.variants.map((v) => v.size)));
  }, [product.variants]);

  if (sizes.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium ">SELECT SIZE</span>
        {selectedSize && (
          <span className="text-xs text-muted-foreground">{selectedSize}</span>
        )}
      </div>
      <RadioGroup
        value={selectedSize}
        onValueChange={onSizeSelect}
        className="flex flex-wrap gap-2"
      >
        {sizes.map((size) => {
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

// ==================== MAIN PRODUCT CARD COMPONENT ====================
export default function ProductCard({
  product,
  className = "",
  onAddToCart,
  onAddToWishlist,
  layout = "grid",
}: ProductCardProps & { layout?: "grid" | "list" }) {
  const [selectedSize, setSelectedSize] = useState(() => {
    const variants = product.variants || [];
    const defaultVariant = variants.find((v) => v.isDefault);
    return defaultVariant?.size || variants[0]?.size || "";
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    const variants = product.variants || [];
    const defaultVariant = variants.find((v) => v.isDefault);
    return defaultVariant?.color.hex || variants[0]?.color.hex || "";
  });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [pendingAction, setPendingAction] = useState<
    "addToBag" | "buyNow" | null
  >(null);

  const router = useRouter();

  // Check if a size is available
  const isSizeAvailable = (size: string) => {
    return product.variants.some((v) => v.size === size && v.stockQuantity > 0);
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

  // Action handlers
  const handleAddToCart = () => {
    setPendingAction("addToBag");
    setShowSizeModal(true);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);

    if (isWishlisted) {
      toast.info(`${product.title} has been removed from your wishlist.`, {
        id: `wishlist-${product.id}`,
      });
    } else {
      toast.success(`${product.title} has been added to your wishlist.`, {
        id: `wishlist-${product.id}`,
      });
    }
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
        `${product.title} (Size: ${selectedSize}) has been added to your bag.`,
      );
      setShowSizeModal(false);
      setPendingAction(null);
    } else if (action === "buyNow") {
      setShowSizeModal(false);
      setPendingAction(null);
      const params = new URLSearchParams({
        product: product.slug || "",
        color: selectedColor,
        size: selectedSize,
        qty: "1",
      });
      router.push(`/checkout/quick?${params.toString()}`);
    }
  };

  // Derived data based on selected variant
  const selectedVariant = useMemo(() => {
    return (
      product.variants.find(
        (v) => v.color.hex === selectedColor && v.size === selectedSize,
      ) ||
      product.variants.find((v) => v.color.hex === selectedColor) ||
      product.variants[0]
    );
  }, [product.variants, selectedColor, selectedSize]);

  const currentPrice = selectedVariant?.price || product.basePrice;
  const originalPrice = selectedVariant?.originalPrice;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const discountPercentage =
    selectedVariant?.discount ||
    (originalPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0);
  const isOutOfStock = product.variants.every((v) => v.stockQuantity === 0);

  if (layout === "list") {
    return (
      <TooltipProvider>
        <motion.div
          layout
          className={`group relative rounded-xl border border-border hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-row ${className}`}
        >
          {/* Image Section - Fixed Width */}
          <div className="w-48 sm:w-64 shrink-0 relative">
            <ProductImageSection
              product={product}
              isWishlisted={isWishlisted}
              isOutOfStock={isOutOfStock}
              discountPercentage={discountPercentage}
              onAddToWishlist={handleAddToWishlist}
              selectedColorName={
                product.variants.find((v) => v.color.hex === selectedColor)
                  ?.color.name
              }
            />
          </div>

          {/* Content Section */}
          <div className="p-6 flex flex-col flex-1 justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted">
                    {product.brand}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-lg transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <PriceSection product={product} savings={savings} />

              <div className="flex gap-6 pt-2">
                <div className="space-y-1">
                  <ColorOptions
                    product={product}
                    selectedColor={selectedColor}
                    onColorSelect={handleColorSelect}
                  />
                </div>
                {/* Size could go here if needed in list view */}
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-auto border-t border-primary-foreground">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Bag
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                <Zap className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddToWishlist}
                className="shrink-0 text-muted-foreground hover:text-destructive-foreground"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-destructive-foreground text-destructive-foreground" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Modals reuse */}
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

          <SizeChartDrawer
            product={product}
            open={sizeChartOpen}
            onOpenChange={setSizeChartOpen}
          />
        </motion.div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        layout
        className={`group relative rounded-2xl border bg-background overflow-hidden transition-all duration-700 flex flex-col ${className}`}
      >
        <div className="relative w-full overflow-hidden bg-secondary/20">
          <ProductImageSection
            product={product}
            isWishlisted={isWishlisted}
            isOutOfStock={isOutOfStock}
            discountPercentage={discountPercentage}
            onAddToWishlist={handleAddToWishlist}
            selectedColorName={
              product.variants.find((v) => v.color.hex === selectedColor)?.color
                .name
            }
          />
        </div>

        {/* Info Container */}
        <div className="p-4 flex flex-col bg-background z-30 transition-all duration-500">
          <div className="space-y-3">
            {/* Subtitle/Brand */}
            <div className="transition-all duration-500 transform group-hover:-translate-y-1">
              <ProductInfoHeader product={product} />
            </div>

            <div className="flex items-end justify-between gap-2 transition-all duration-500">
              <PriceSection product={product} savings={savings} />
              <ColorOptions
                product={product}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
              />
            </div>
          </div>

          {/* Hidden Action Buttons - revealed on hover */}
          <div className="group-hover:mt-4 h-0 group-hover:h-9 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <ActionButtons
              isOutOfStock={isOutOfStock}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
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

        {/* Size Chart (no drawer) */}
        <SizeChartDrawer
          product={product}
          open={sizeChartOpen}
          onOpenChange={setSizeChartOpen}
        />
      </motion.div>
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
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <SizeChart brand={product.brand} category={product.category} />
      </DialogContent>
    </Dialog>
  );
}
