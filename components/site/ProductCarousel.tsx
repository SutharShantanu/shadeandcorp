"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";
import { Product } from "@/types/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  className?: string;
  onAddToCart?: (
    product: Product,
    quantity: number,
    size: string,
    color: string
  ) => void;
  onAddToWishlist?: (product: Product) => void;
}

export default function ProductCarousel({
  products,
  title = "Featured Products",
  subtitle = "Handpicked selections curated just for you",
  badgeText,
  autoplay = true,
  autoplayDelay = 4000,
  loop = true,
  className,
  onAddToCart,
  onAddToWishlist,
}: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Setup autoplay plugin instance
  const autoplayPlugin = React.useMemo(() => {
    if (!autoplay) return undefined;
    return Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, [autoplay, autoplayDelay]);

  // Update carousel state on slide change
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Toggle autoplay on/off
  const toggleAutoplay = useCallback(() => {
    if (!api) return;
    const autoplayInst = api.plugins()?.autoplay;
    if (!autoplayInst) return;

    if (autoplayInst.isPlaying()) {
      autoplayInst.stop();
      setIsPlaying(false);
    } else {
      autoplayInst.play();
      setIsPlaying(true);
    }
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full py-8", className)}>
      {/* Header & Controls Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-1">
        <div>
          {badgeText && (
            <Badge variant="outline" className="mb-2.5 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="mr-1.5 size-3 text-primary inline" />
              {badgeText}
            </Badge>
          )}
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-sm md:text-base mt-1 max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls - Separated Chips with Uniform Height */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          {/* Chip 1: Slide Counter */}
          {count > 0 && (
            <div className="h-9 flex items-center justify-center text-xs font-mono font-semibold px-3.5 rounded-full bg-muted text-foreground border border-border shadow-2xs select-none">
              {String(current).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </div>
          )}

          {/* Chip 2: Pagination Dots */}
          {count > 1 && (
            <div className="hidden sm:flex h-9 items-center justify-center gap-1.5 bg-muted rounded-full px-3.5 border border-border shadow-2xs">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden",
                    current - 1 === index
                      ? "w-5 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>
          )}

          {/* Chip 3: Autoplay Play/Pause Toggle */}
          {autoplay && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleAutoplay}
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              className="h-9 w-9 rounded-full shadow-2xs transition-transform active:scale-95 bg-muted hover:bg-muted/80 p-0 flex items-center justify-center shrink-0"
              title={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5 ml-0.5" />
              )}
            </Button>
          )}

          {/* Navigation Arrows Chip */}
          <div className="h-9 flex items-center gap-1 bg-muted px-1 rounded-full border border-border shadow-2xs">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => api?.scrollPrev()}
              disabled={!api?.canScrollPrev()}
              aria-label="Previous product slide"
              className="rounded-full size-7 p-0"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => api?.scrollNext()}
              disabled={!api?.canScrollNext()}
              aria-label="Next product slide"
              className="rounded-full size-7 p-0"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Shadcn Carousel Viewport */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop,
        }}
        plugins={autoplayPlugin ? [autoplayPlugin] : []}
        className="w-full relative"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id || index}
              className="pl-3 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="h-full p-0.5">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onAddToWishlist={onAddToWishlist}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Native Floating Carousel Arrows (visible on hover) */}
        <CarouselPrevious className="hidden md:flex -left-4 hover:scale-105 transition-transform" />
        <CarouselNext className="hidden md:flex -right-4 hover:scale-105 transition-transform" />
      </Carousel>

      {/* Pagination Dot Navigation */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-hidden",
                current - 1 === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
