"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
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
import { Product } from "@/types/ProductCard";
import { ZoomableImage } from "@/components/ui/zoomable-image";

export function ProductGallery({
  product,
  selectedColorName,
}: {
  product: Product;
  selectedColorName?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [desktopIndex, setDesktopIndex] = useState(0);
  const { selectedIndex, onDotButtonClick } = useDotButton(api);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(api);

  const filteredAssets = useMemo(() => {
    const assets = product.assets ?? [];
    const sorted = [...assets].sort((a, b) => a.order - b.order);
    return sorted.slice(0, 10);
  }, [product.assets]);

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
      {/* Desktop: Master/Detail Layout */}
      <div className="hidden lg:flex flex-row gap-4 pb-8 h-[600px]">
        {/* Desktop Thumbnails (Left Side) */}
        {filteredAssets.length > 1 && (
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide w-24 shrink-0">
            {filteredAssets.map((asset, idx) => (
              <button
                key={`thumb-${idx}`}
                onClick={() => setDesktopIndex(idx)}
                className={`relative w-full aspect-4/5 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  desktopIndex === idx
                    ? "border-primary ring-2 ring-primary/20 ring-offset-1"
                    : "border-transparent hover:border-border"
                }`}
              >
                <Image
                  src={asset.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Featured Image */}
        <div className="relative flex-1 rounded-2xl overflow-visible bg-muted border border-border">
          <div className="w-full h-full overflow-hidden rounded-2xl">
            <ZoomableImage
              src={filteredAssets[desktopIndex]?.url || filteredAssets[0].url}
              alt={
                filteredAssets[desktopIndex]?.alt ||
                `${product.title} featured image`
              }
            />
          </div>
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
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
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
    </>
  );
}
