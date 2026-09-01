"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Star } from "lucide-react";
import ProductCard from "@/components/site/ProductCard";
import type { Product } from "@/types/ProductCard";
import { cn } from "@/lib/utils";

export interface LookbookHotspot {
  id: string;
  top: string;
  left: string;
  product: Product;
}

export interface LookbookHotspotsProps {
  image?: string;
  badgeText?: string;
  hotspots: LookbookHotspot[];
  activeHotspotId?: string;
  defaultActiveHotspotId?: string;
  onHotspotChange?: (id: string) => void;
  className?: string;
}

export default function LookbookHotspots({
  image = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1500&fit=crop",
  badgeText = "EDITORIAL LOOKBOOK 2024",
  hotspots,
  activeHotspotId: controlledActiveId,
  defaultActiveHotspotId,
  onHotspotChange,
  className,
}: LookbookHotspotsProps) {
  const [internalActiveId, setInternalActiveId] = useState<string>(
    defaultActiveHotspotId || hotspots[0]?.id || ""
  );

  const activeHotspotId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  const handleSelectHotspot = (id: string) => {
    if (controlledActiveId === undefined) {
      setInternalActiveId(id);
    }
    onHotspotChange?.(id);
  };

  const activeHotspotItem = hotspots.find((p) => p.id === activeHotspotId) || hotspots[0];
  const activeProduct = activeHotspotItem?.product;

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-8 items-center", className)}>
      {/* Editorial Model Photo with Pins */}
      <div className="lg:col-span-7 relative min-h-[520px] md:min-h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-border/60 bg-muted">
        <Image
          src={image}
          alt={badgeText}
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        {badgeText && (
          <div className="absolute top-6 left-6 z-10">
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs uppercase tracking-wider shadow-md">
              {badgeText}
            </Badge>
          </div>
        )}

        {/* Hotspot Pins */}
        {hotspots.map((pin) => {
          const isActive = activeHotspotId === pin.id;
          return (
            <button
              key={pin.id}
              onClick={() => handleSelectHotspot(pin.id)}
              onMouseEnter={() => handleSelectHotspot(pin.id)}
              className={cn(
                "absolute z-20 size-8 sm:size-10 rounded-full border-2 border-white backdrop-blur-md flex items-center justify-center cursor-pointer transition-all transform -translate-x-1/2 -translate-y-1/2 shadow-2xl",
                isActive
                  ? "bg-primary text-primary-foreground scale-125 ring-4 ring-primary/40"
                  : "bg-black/60 text-white hover:bg-primary hover:scale-110"
              )}
              style={{ top: pin.top, left: pin.left }}
              aria-label={`Hotspot pin for ${pin.product.title}`}
            >
              <Plus
                className={cn(
                  "size-4 transition-transform",
                  isActive && "rotate-45"
                )}
              />
              <span className="animate-ping absolute inset-0 rounded-full bg-primary/40 -z-10" />
            </button>
          );
        })}
      </div>

      {/* Tagged Product Display */}
      <div className="lg:col-span-5 w-full">
        {activeProduct ? (
          <Card className="w-full p-2 border-border/60 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-3xs uppercase font-mono tracking-widest"
                >
                  TAGGED RUNWAY PIECE
                </Badge>
                <div className="flex items-center gap-1 text-xs font-bold text-warning">
                  <Star className="size-3.5 fill-warning" />
                  <span>{activeProduct.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Render standard ProductCard to maintain identical design */}
              <ProductCard product={activeProduct} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
