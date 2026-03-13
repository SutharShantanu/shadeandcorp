"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/ProductCard";

export function SizeSelector({
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
                className={`relative flex items-center justify-center min-w-11 h-11 px-3 text-sm font-semibold border-2 rounded-xl cursor-pointer transition-all duration-200 select-none
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
