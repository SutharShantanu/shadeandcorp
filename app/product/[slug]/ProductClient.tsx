"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Zap,
  Share2,
  Star,
  Ruler,
  ArrowLeft,
  Check,
  AlertCircle,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Package,
  Tag,
  Home,
  ChevronRight,
  Copy,
  MapPin,
  ThumbsUp,
  BadgeCheck,
  PercentCircle,
  Banknote,
  Gift,
  ZoomIn,
  X,
  Navigation,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SizeChart } from "@/components/ui/size-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/ui/embla-carousel-dot-button";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "@/components/ui/embla-carousel-arrow-button";
import { Product, Variant } from "@/types/ProductCard";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { add, remove } from "@/features/wishlist/wishlistSlice";
import QuickCheckoutModal from "@/components/modal/QuickCheckoutModal";
import ProductCard from "@/components/site/ProductCard";
import { bankOffers, type BankOffer } from "@/lib/constants";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeSelector } from "@/components/product/SizeSelector";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";
import { PolicyBadges } from "@/components/product/PolicyBadges";
import { ReviewsSection } from "@/components/product/ReviewsSection";
import { EmiAndBankOffersCard } from "@/components/product/EmiAndBankOffersCard";
import { SimilarProducts } from "@/components/product/SimilarProducts";

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const isWishlisted = product
    ? wishlistItems.some((p) => p.id === product.id)
    : false;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          const p: Product = data.data;
          if (!p.variants) (p as any).variants = [];
          if (!p.assets) (p as any).assets = [];
          setProduct(p);
          const variants = p.variants ?? [];
          const def = variants.find((v) => v.isDefault) || variants[0];
          setSelectedColor(def?.color.hex || "");
          setSelectedSize(def?.size || "");
        } else {
          setNotFoundState(true);
        }
      })
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const isSizeAvailable = useCallback(
    (size: string) =>
      product
        ? (product.variants ?? []).some(
            (v) => v.size === size && v.stockQuantity > 0,
          )
        : false,
    [product],
  );

  const handleSizeSelect = (size: string) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
      setSizeError("");
    }
  };

  const handleColorSelect = (hex: string) => {
    setSelectedColor(hex);
    const v = (product?.variants ?? []).find(
      (v) => v.color.hex === hex && v.stockQuantity > 0,
    );
    if (v) setSelectedSize(v.size);
  };

  const handleAddToCart = () => {
    if (!selectedSize && (product?.variants ?? []).length > 0) {
      setSizeError("Please select a size to continue");
      return;
    }

    const variant =
      (product?.variants ?? []).find(
        (v) => v.color.hex === selectedColor && v.size === selectedSize,
      ) ?? (product?.variants ?? [])[0];

    const colorName = variant?.color.name ?? selectedColorName;
    const size = selectedSize ?? variant?.size;

    toast.success(`Added to Bag`, {
      description: [product!.title, colorName, size]
        .filter(Boolean)
        .join(" · "),
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize && (product?.variants ?? []).length > 0) {
      setSizeError("Please select a size to continue");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(remove(product.id));
      toast.info(`${product.title} removed from wishlist`, {
        id: `wishlist-${product.id}`,
      });
    } else {
      dispatch(add(product));
      toast.success(`${product.title} added to wishlist!`, {
        id: `wishlist-${product.id}`,
      });
    }
  };

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    const variants = product.variants ?? [];
    return (
      variants.find(
        (v) => v.color.hex === selectedColor && v.size === selectedSize,
      ) ||
      variants.find((v) => v.color.hex === selectedColor) ||
      variants[0]
    );
  }, [product, selectedColor, selectedSize]);

  const currentPrice = selectedVariant?.price ?? product?.basePrice ?? 0;
  const originalPrice = selectedVariant?.originalPrice;
  const savings = originalPrice ? originalPrice - currentPrice : 0;
  const discountPct =
    selectedVariant?.discount ??
    (originalPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0);
  const isOutOfStock = product
    ? (product.variants ?? []).length === 0 ||
      (product.variants ?? []).every((v) => v.stockQuantity === 0)
    : false;

  const colors = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set((product.variants ?? []).map((v) => JSON.stringify(v.color))),
    ).map((s) => JSON.parse(s) as Variant["color"]);
  }, [product]);

  const selectedColorObj = colors.find((c) => c.hex === selectedColor);
  const selectedColorName = (product?.variants ?? []).find(
    (v) => v.color.hex === selectedColor,
  )?.color.name;

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-64 bg-muted rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="aspect-4/5 bg-muted rounded-2xl" />
            <div className="aspect-4/5 bg-muted rounded-2xl" />
          </div>
          <div className="space-y-5">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-9 w-3/4 bg-muted rounded" />
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-10 w-32 bg-muted rounded" />
            <div className="h-20 bg-muted rounded-xl" />
            <div className="h-16 bg-muted rounded-xl" />
            <div className="flex gap-3">
              <div className="h-12 flex-1 bg-muted rounded-xl" />
              <div className="h-12 flex-1 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFoundState || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-4">
        <div className="text-7xl">🔍</div>
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground max-w-sm">
          The product you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-0 space-y-4">
        {/* ── BREADCRUMB ── */}
        <ProductBreadcrumb
          category={product.category}
          title={product.title}
          slug={product.slug}
        />

        {/* ── MAIN GRID ── */}
        <div className="flex items-start justify-between gap-8">
          {/* LEFT: Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-3/5"
          >
            <ProductGallery
              product={product}
              selectedColorName={selectedColorName}
            />
          </motion.div>

          {/* RIGHT: Sticky details panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="w-2/5"
          >
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Brand + actions */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
                    {product.brand}
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight">
                    {product.title}
                  </h1>
                </div>
                <div className="flex gap-1 shrink-0 mt-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-9 w-9 rounded-full border transition-all ${
                      isWishlisted ? "border-destructive" : "border-border"
                    }`}
                    onClick={handleWishlist}
                  >
                    <Heart
                      className={`w-4 h-4 ${isWishlisted ? "fill-destructive text-destructive" : ""}`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 rounded-full border border-border"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.title,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied!");
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Rating row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full px-2.5 py-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviewCount.toLocaleString()} ratings
                </span>
                <Separator orientation="vertical" className="h-3" />
                <div className="flex gap-1 flex-wrap">
                  {product.isNew && (
                    <Badge className="text-xs py-0 px-2 h-5">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge color="warning" className="text-xs py-0 px-2 h-5">
                      Bestseller
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge color="info" className="text-xs py-0 px-2 h-5">
                      Featured
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge
                      variant="secondary"
                      className="text-xs py-0 px-2 h-5"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black">${currentPrice}</span>
                  {originalPrice && (
                    <span className="text-base text-muted-foreground line-through">
                      ${originalPrice}
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="text-base font-bold text-emerald-600">
                      ({discountPct}% OFF)
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    You save ${savings.toFixed(2)} · Inclusive of all taxes
                  </p>
                )}
                {!savings && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inclusive of all taxes
                  </p>
                )}
              </div>

              {/* Offers */}
              <EmiAndBankOffersCard
                offers={bankOffers}
                price={selectedVariant?.price || 0}
              />

              <Separator />

              {/* Color selector */}
              {colors.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    Color{" "}
                    {selectedColorObj && (
                      <span className="normal-case font-normal text-muted-foreground ml-1">
                        — {selectedColorObj.name}
                      </span>
                    )}
                  </p>
                  <RadioGroup
                    value={selectedColor}
                    onValueChange={handleColorSelect}
                    className="flex flex-wrap gap-2"
                  >
                    {colors.map((color) => (
                      <div key={color.hex} className="relative">
                        <RadioGroupItem
                          value={color.hex}
                          id={`color-${color.hex}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`color-${color.hex}`}
                          title={color.name}
                          className="relative flex items-center justify-center size-8 rounded-full cursor-pointer transition-all duration-200 shadow-sm hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.hex && (
                            <>
                              <Check
                                className="size-4 drop-shadow"
                                style={{
                                  color:
                                    parseInt(color.hex.slice(1), 16) >
                                    0xffffff / 2
                                      ? "#000"
                                      : "#fff",
                                }}
                              />
                              <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-foreground" />
                            </>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Size selector */}
              {(product.variants ?? []).length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
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
                      onClick={() => setSizeChartOpen(true)}
                    >
                      <Ruler className="size-2.5" />
                      Size Guide
                    </Button>
                  </div>
                  <SizeSelector
                    product={product}
                    selectedSize={selectedSize}
                    sizeError={sizeError}
                    onSizeSelect={handleSizeSelect}
                    isSizeAvailable={isSizeAvailable}
                  />
                </div>
              )}

              {/* Stock indicator */}
              {!isOutOfStock && selectedVariant && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedVariant.stockQuantity > 10
                        ? "bg-emerald-500"
                        : selectedVariant.stockQuantity > 0
                          ? "bg-amber-500"
                          : "bg-destructive"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {selectedVariant.stockQuantity > 10
                      ? "In Stock"
                      : selectedVariant.stockQuantity > 0
                        ? `Only ${selectedVariant.stockQuantity} left`
                        : "Out of Stock"}
                  </span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-13 text-base font-bold rounded-xl group"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Add to Bag
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-13 text-base font-bold rounded-xl group"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Buy Now
                </Button>
              </div>
              <Separator />
              {/* Delivery check */}
              <DeliveryCheck />

              {/* Policies */}
              <PolicyBadges />

              {/* Description / Details tabs */}
              <Tabs defaultValue="description" className="w-full p-0">
                <TabsList className="w-full justify-start flex gap-4">
                  <TabsTrigger
                    value="description"
                    className="text-sm font-semibold capitalize text-muted-foreground"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="text-sm font-semibold capitalize text-muted-foreground"
                  >
                    Details
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="description"
                  className="text-sm text-muted-foreground leading-relaxed mt-4 animate-in fade-in-50 duration-300 outline-none"
                >
                  {product.description || (
                    <span className="italic">No description provided.</span>
                  )}
                </TabsContent>
                <TabsContent
                  value="details"
                  className="text-sm divide-y divide-border/60 animate-in fade-in-50 duration-300 outline-none"
                >
                  {[
                    { label: "SKU", value: product.sku },
                    {
                      label: "Category",
                      value: `${product.category}${product.subCategory ? ` / ${product.subCategory}` : ""}`,
                    },
                    { label: "Brand", value: product.brand },
                    product.weight
                      ? { label: "Weight", value: `${product.weight}g` }
                      : null,
                    product.dimensions
                      ? {
                          label: "Dimensions",
                          value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`,
                        }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((row) => (
                      <div
                        key={row!.label}
                        className="flex justify-between py-2.5"
                      >
                        <span className="text-muted-foreground">
                          {row!.label}
                        </span>
                        <span className="font-medium capitalize text-right max-w-[60%]">
                          {row!.value}
                        </span>
                      </div>
                    ))}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap py-2.5">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {product.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>

        {/* ── REVIEWS ── */}
        <ReviewsSection
          rating={product.rating}
          reviewCount={product.reviewCount}
        />

        {/* ── SIMILAR PRODUCTS ── */}
        <SimilarProducts
          category={product.category}
          currentSlug={product.slug}
        />
      </div>

      {/* ── MODALS ── */}
      <Dialog open={sizeChartOpen} onOpenChange={setSizeChartOpen}>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Size Guide</DialogTitle>
          </DialogHeader>
          <SizeChart category={product.category} brand={product.brand} />
        </DialogContent>
      </Dialog>

      {showCheckoutModal && (
        <QuickCheckoutModal
          open={showCheckoutModal}
          onOpenChange={(v: boolean) => setShowCheckoutModal(v)}
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={1}
        />
      )}
    </>
  );
}
