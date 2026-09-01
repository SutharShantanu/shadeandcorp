"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/site/ProductCard";
import type { Product } from "@/types/ProductCard";
import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
  count: number;
}

export interface FilterableCatalogProps {
  products: Product[];
  filters?: FilterOption[];
  activeFilter?: string;
  defaultActiveFilter?: string;
  onFilterChange?: (filterId: string) => void;
  className?: string;
  gridClassName?: string;
}

export default function FilterableCatalog({
  products,
  filters: customFilters,
  activeFilter: controlledActiveFilter,
  defaultActiveFilter = "all",
  onFilterChange,
  className,
  gridClassName,
}: FilterableCatalogProps) {
  const [internalActiveFilter, setInternalActiveFilter] = useState<string>(defaultActiveFilter);

  const activeFilter = controlledActiveFilter !== undefined ? controlledActiveFilter : internalActiveFilter;

  const handleFilterClick = (filterId: string) => {
    if (controlledActiveFilter === undefined) {
      setInternalActiveFilter(filterId);
    }
    onFilterChange?.(filterId);
  };

  const autoFilterCounts = useMemo(() => {
    return {
      all: products.length,
      trending: products.filter((p) => p.isTrending).length,
      bestsellers: products.filter((p) => p.isBestSeller).length,
      discount: products.filter((p) =>
        p.variants?.some((v) => (v.discount || 0) > 0)
      ).length,
      "low-stock": products.filter((p) => {
        const stock = p.variants?.reduce((acc, v) => acc + v.stockQuantity, 0) ?? 0;
        return stock < 10;
      }).length,
    };
  }, [products]);

  const defaultFilters: FilterOption[] = useMemo(
    () => [
      { id: "all", label: "All New", count: autoFilterCounts.all },
      { id: "trending", label: "Trending", count: autoFilterCounts.trending },
      { id: "bestsellers", label: "Bestsellers", count: autoFilterCounts.bestsellers },
      { id: "discount", label: "On Sale", count: autoFilterCounts.discount },
      { id: "low-stock", label: "Almost Gone", count: autoFilterCounts["low-stock"] },
    ],
    [autoFilterCounts]
  );

  const filters = customFilters || defaultFilters;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      switch (activeFilter) {
        case "trending":
          return product.isTrending;
        case "bestsellers":
          return product.isBestSeller;
        case "discount":
          return product.variants?.some((v) => (v.discount || 0) > 0);
        case "low-stock": {
          const totalStock = product.variants?.reduce(
            (acc, v) => acc + v.stockQuantity,
            0
          ) ?? 0;
          return totalStock < 10;
        }
        case "all":
        default:
          return true;
      }
    });
  }, [products, activeFilter]);

  return (
    <div className={cn("w-full", className)}>
      {/* Filter Tabs Bar */}
      {filters.length > 0 && (
        <div className="flex justify-center mb-10 md:mb-14">
          <div className="flex items-center gap-1.5 p-1.5 bg-muted rounded-full border border-border overflow-x-auto max-w-full scrollbar-none shadow-2xs">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={cn(
                    "relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer select-none",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span>{filter.label}</span>
                  <span
                    className={cn(
                      "text-3xs font-mono px-1.5 py-0.5 rounded-full transition-colors",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                        : "bg-background/80 text-muted-foreground"
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8", gridClassName)}>
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="w-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
