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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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

// ─────────────────────────────────────────────
// BREADCRUMB (chip-style active)
// ─────────────────────────────────────────────

function ProductBreadcrumb({
  category,
  title,
  slug,
}: {
  category: string;
  title: string;
  slug: string;
}) {
  return (
    <div className="inline-flex items-center bg-muted/60 border border-border/50 rounded-full px-2 py-1 pr-1 backdrop-blur-sm">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 sm:gap-1.5 text-xs flex-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground font-semibold transition-colors"
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-3 h-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="capitalize hover:text-foreground font-semibold transition-colors"
              >
                {category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-3 h-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-full truncate font-semibold max-w-[140px] sm:max-w-[200px]">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

// ─────────────────────────────────────────────
// IMAGE GALLERY — Myntra-style stacked + zoom
// ─────────────────────────────────────────────

function ProductGallery({
  product,
  selectedColorName,
}: {
  product: Product;
  selectedColorName?: string;
}) {
  const [zoomedAsset, setZoomedAsset] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, onDotButtonClick } = useDotButton(api);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(api);

  const filteredAssets = useMemo(() => {
    const variants = product.variants ?? [];
    const assets = product.assets ?? [];
    const selectedVariant = variants.find(
      (v) => v.color.name === selectedColorName,
    );
    const variantId = selectedVariant?.id;
    const filtered = assets
      .filter((a) => !a.variantId || a.variantId === variantId)
      .sort((a, b) => a.order - b.order);
    return filtered.length > 0 ? filtered : assets;
  }, [product.assets, product.variants, selectedColorName]);

  useEffect(() => {
    if (api) api.scrollTo(0);
  }, [api, filteredAssets]);

  // No images state
  if (filteredAssets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center aspect-square rounded-2xl bg-muted/40 border border-dashed border-border text-muted-foreground gap-3">
        <Package className="w-16 h-16 opacity-30" />
        <p className="text-sm font-medium">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: stacked vertical images */}
      <div className="hidden lg:flex gap-3">
        {/* Thumbnail strip */}
        {filteredAssets.length > 1 && (
          <div className="flex flex-col gap-2 w-[72px] shrink-0">
            {filteredAssets.map((asset, idx) => (
              <button
                key={`thumb-${idx}`}
                onClick={() => api?.scrollTo(idx)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  selectedIndex === idx
                    ? "border-foreground shadow-md"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={asset.url}
                  alt={asset.alt || `Thumb ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Stacked images */}
        <div className="flex-1 flex flex-col gap-3">
          {filteredAssets.map((asset, idx) => (
            <motion.div
              key={`stack-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl bg-muted cursor-zoom-in"
              onClick={() => setZoomedAsset(asset.url)}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={asset.url}
                  alt={asset.alt || `${product.title} image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 50vw, 40vw"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                    <ZoomIn className="w-4 h-4 text-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: carousel */}
      <div className="lg:hidden relative">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {filteredAssets.map((asset, index) => (
              <CarouselItem key={`mobile-${index}`} className="pl-0">
                <div
                  className="relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-zoom-in"
                  onClick={() => setZoomedAsset(asset.url)}
                >
                  <Image
                    src={asset.url}
                    alt={asset.alt || `${product.title} — Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {filteredAssets.length > 1 && (
            <>
              <PrevButton
                enabled={!prevBtnDisabled}
                onClick={onPrevButtonClick}
              />
              <NextButton
                enabled={!nextBtnDisabled}
                onClick={onNextButtonClick}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {filteredAssets.map((_, idx) => (
                  <DotButton
                    key={idx}
                    selected={idx === selectedIndex}
                    onClick={() => onDotButtonClick(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === selectedIndex
                        ? "bg-white scale-125"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </Carousel>
        {filteredAssets.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {selectedIndex + 1}/{filteredAssets.length}
          </div>
        )}
      </div>

      {/* Zoom lightbox */}
      <Dialog open={!!zoomedAsset} onOpenChange={() => setZoomedAsset(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black/95 border-none">
          <button
            onClick={() => setZoomedAsset(null)}
            className="absolute top-3 right-3 z-50 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl">
            <Image
              src={zoomedAsset || ""}
              alt="Zoomed product image"
              fill
              className="object-contain"
              sizes="80vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─────────────────────────────────────────────
// SIZE SELECTOR
// ─────────────────────────────────────────────

function SizeSelector({
  product,
  selectedSize,
  sizeError,
  onSizeSelect,
  isSizeAvailable,
}: {
  product: Product;
  selectedSize: string;
  sizeError: string;
  onSizeSelect: (s: string) => void;
  isSizeAvailable: (s: string) => boolean;
}) {
  const sizes = useMemo(
    () => Array.from(new Set((product.variants ?? []).map((v) => v.size))),
    [product.variants],
  );
  if (sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <RadioGroup
        value={selectedSize}
        onValueChange={onSizeSelect}
        className="flex flex-wrap gap-2"
      >
        {sizes.map((size) => {
          const available = isSizeAvailable(size);
          const active = selectedSize === size;
          return (
            <div key={size} className="relative">
              <RadioGroupItem
                value={size}
                id={`size-${size}`}
                disabled={!available}
                className="sr-only"
              />
              <Label
                htmlFor={`size-${size}`}
                className={`relative flex items-center justify-center min-w-[48px] h-12 px-3 text-sm font-semibold border-2 rounded-xl cursor-pointer transition-all duration-200 select-none
                  ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                      : available
                        ? "border-border bg-background text-foreground hover:border-primary/60"
                        : "border-border/40 bg-muted/50 text-muted-foreground cursor-not-allowed"
                  }`}
              >
                {size}
                {!available && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden pointer-events-none">
                    <div className="w-full h-px bg-muted-foreground/60 rotate-45 scale-150" />
                  </div>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
      {sizeError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{sizeError}</span>
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// OFFERS SECTION
// ─────────────────────────────────────────────

const MOCK_OFFERS = [
  {
    icon: Banknote,
    title: "5% Instant Discount",
    desc: "On SBI Credit/Debit Cards. Min. order $50.",
    code: "SBI5OFF",
    color: "text-emerald-600",
  },
  {
    icon: PercentCircle,
    title: "10% Cashback",
    desc: "Via Paytm UPI on your first 3 transactions.",
    code: "PAYTM10",
    color: "text-blue-500",
  },
  {
    icon: Gift,
    title: "Free Gift Wrapping",
    desc: "Complimentary on orders above $100.",
    code: "GIFTWRAP",
    color: "text-purple-500",
  },
];

function OffersSection() {
  const [open, setOpen] = useState(true);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" copied!`);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
      >
        <span className="text-sm font-semibold flex items-center gap-2">
          <PercentCircle className="w-4 h-4 text-primary" />
          Best Offers
        </span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-border">
              {MOCK_OFFERS.map((offer) => (
                <div
                  key={offer.code}
                  className="flex items-start gap-3 px-4 py-3"
                >
                  <offer.icon
                    className={`w-5 h-5 mt-0.5 shrink-0 ${offer.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{offer.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {offer.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="flex items-center gap-1 border border-dashed border-primary/60 text-primary text-xs px-2 py-1 rounded-md hover:bg-primary/5 transition-colors shrink-0"
                  >
                    <Copy className="w-3 h-3" />
                    {offer.code}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// DELIVERY PINCODE
// ─────────────────────────────────────────────

function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<null | "ok" | "fail">(null);
  const [checking, setChecking] = useState(false);

  const check = () => {
    if (pincode.length < 5) {
      toast.error("Enter a valid pincode");
      return;
    }
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      setResult(Math.random() > 0.2 ? "ok" : "fail");
      setChecking(false);
    }, 800);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Check Delivery</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Enter pincode / ZIP"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value);
            setResult(null);
          }}
          maxLength={10}
          className="h-9 text-sm max-w-[180px]"
          onKeyDown={(e) => e.key === "Enter" && check()}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={check}
          disabled={checking}
          className="h-9 px-4"
        >
          {checking ? "Checking…" : "Check"}
        </Button>
      </div>
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-1.5 text-xs font-medium ${
              result === "ok" ? "text-emerald-600" : "text-destructive"
            }`}
          >
            {result === "ok" ? (
              <>
                <Truck className="w-3.5 h-3.5" />
                Free delivery by{" "}
                {new Date(Date.now() + 4 * 86400000).toLocaleDateString(
                  "en-US",
                  { weekday: "short", month: "short", day: "numeric" },
                )}
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Not deliverable to this location
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// POLICY BADGES
// ─────────────────────────────────────────────

function PolicyBadges() {
  const items = [
    { icon: Truck, label: "Free Shipping", sub: "orders > $50" },
    { icon: RefreshCcw, label: "30-Day Returns", sub: "hassle-free" },
    { icon: ShieldCheck, label: "1 Year Warranty", sub: "manufacturer" },
    { icon: Package, label: "Secure Packaging", sub: "damage-free" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(({ icon: Icon, label, sub }) => (
        <div
          key={label}
          className="flex flex-col items-center text-center gap-1 py-3 px-1 rounded-xl border border-border bg-muted/20"
        >
          <Icon className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-semibold leading-tight">
            {label}
          </span>
          <span className="text-[9px] text-muted-foreground">{sub}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// REVIEWS SECTION
// ─────────────────────────────────────────────

const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Arjun Sharma",
    rating: 5,
    text: "Absolutely love this product! Build quality is top-notch and fits perfectly. Delivery was quick too.",
    date: "Jan 28, 2025",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    name: "Priya Mehta",
    rating: 4,
    text: "Great value for money. Looks exactly as shown. The only minor thing is sizing runs a little large.",
    date: "Feb 3, 2025",
    helpful: 11,
    verified: true,
  },
  {
    id: 3,
    name: "Rahul Gupta",
    rating: 3,
    text: "Decent product but the color is slightly different from the photos. Still happy with the purchase overall.",
    date: "Jan 15, 2025",
    helpful: 5,
    verified: false,
  },
  {
    id: 4,
    name: "Sara Patel",
    rating: 5,
    text: "Exceeded expectations! The material is premium and comfortable. Will definitely buy more from this brand.",
    date: "Feb 18, 2025",
    helpful: 38,
    verified: true,
  },
];

function StarRating({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-${size} h-${size} ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewsSection({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());

  // Distribution: generate believable bars based on rating
  const distribution = [
    { stars: 5, pct: 62 },
    { stars: 4, pct: 20 },
    { stars: 3, pct: 10 },
    { stars: 2, pct: 5 },
    { stars: 1, pct: 3 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Ratings & Reviews</h2>

      {/* Overall + distribution */}
      <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl border border-border bg-muted/20">
        {/* Score */}
        <div className="flex flex-col items-center justify-center gap-1 sm:w-36 shrink-0">
          <span className="text-5xl font-extrabold">{rating}</span>
          <StarRating rating={rating} size={5} />
          <span className="text-xs text-muted-foreground mt-1">
            {reviewCount.toLocaleString()} ratings
          </span>
        </div>

        <Separator orientation="vertical" className="hidden sm:block h-auto" />
        <Separator className="sm:hidden" />

        {/* Bars */}
        <div className="flex-1 space-y-2">
          {distribution.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-xs font-medium w-4 text-right shrink-0">
                {stars}
              </span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <Progress
                value={pct}
                className="h-2 flex-1"
                indicatorClassName={
                  pct >= 50
                    ? "bg-emerald-500"
                    : pct >= 20
                      ? "bg-amber-400"
                      : "bg-red-400"
                }
              />
              <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-2xl border border-border bg-card space-y-2 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    {review.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {review.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={3} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.text}
            </p>
            <button
              onClick={() =>
                setHelpfulVotes((prev) => {
                  const s = new Set(prev);
                  s.has(review.id) ? s.delete(review.id) : s.add(review.id);
                  return s;
                })
              }
              className={`flex items-center gap-1.5 text-xs mt-1 transition-colors ${
                helpfulVotes.has(review.id)
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Helpful ({review.helpful + (helpfulVotes.has(review.id) ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SIMILAR PRODUCTS
// ─────────────────────────────────────────────

function SimilarProducts({
  category,
  currentSlug,
}: {
  category: string;
  currentSlug: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(category)}&limit=8`)
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = data?.data?.products ?? data?.products ?? [];
        const normalized = list
          .filter((p) => p.slug !== currentSlug)
          .slice(0, 6)
          .map((p) => ({
            ...p,
            variants: p.variants ?? [],
            assets: p.assets ?? [],
          }));
        setProducts(normalized);
      })
      .catch(() => {});
  }, [category, currentSlug]);

  if (products.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<"description" | "details">(
    "description",
  );

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
    toast.success(`${product!.title} added to your bag!`);
    setShowCheckoutModal(true);
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
      toast.info(`${product.title} removed from wishlist`);
    } else {
      dispatch(add(product));
      toast.success(`${product.title} added to wishlist!`);
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
            <div className="aspect-[4/5] bg-muted rounded-2xl" />
            <div className="aspect-[4/5] bg-muted rounded-2xl" />
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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-0 space-y-12">
        {/* ── BREADCRUMB ── */}
        <ProductBreadcrumb
          category={product.category}
          title={product.title}
          slug={product.slug}
        />

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 xl:gap-16">
          {/* LEFT: Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
          >
            <div className="lg:sticky lg:top-6 space-y-5">
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
                    <Badge className="text-[10px] py-0 px-2 h-5">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge
                      color="warning"
                      className="text-[10px] py-0 px-2 h-5"
                    >
                      Bestseller
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge color="info" className="text-[10px] py-0 px-2 h-5">
                      Featured
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] py-0 px-2 h-5"
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
              <OffersSection />

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
                          className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-200 shadow-sm hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor === color.hex && (
                            <>
                              <Check
                                className="w-4 h-4 drop-shadow"
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
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-primary hover:text-primary/80"
                      onClick={() => setSizeChartOpen(true)}
                    >
                      <Ruler className="w-3.5 h-3.5 mr-1" />
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

              {/* Delivery check */}
              <DeliveryCheck />

              {/* Policies */}
              <PolicyBadges />

              {/* Description / Details tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-border">
                  {(["description", "details"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative pb-3 px-4 text-sm font-semibold capitalize transition-colors ${
                        activeTab === tab
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tab-line"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "description" ? (
                    <motion.div
                      key="desc"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-sm text-muted-foreground leading-relaxed"
                    >
                      {product.description || (
                        <span className="italic">No description provided.</span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="text-sm divide-y divide-border/60"
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
                              className="text-xs font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
        <DialogContent className="sm:max-w-xl">
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
