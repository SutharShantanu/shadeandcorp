"use client";

import React, { Fragment } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const removeFilter = (section: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(section)?.split(",") || [];
    const newValues = currentValues.filter((v) => v !== value);

    if (newValues.length > 0) {
      params.set(section, newValues.join(","));
    } else {
      params.delete(section);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const removePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname);
  };

  // Group filters by section
  const groupedFilters: { section: string; values: string[] }[] = [];

  const addFilterGroup = (section: string) => {
    const paramValue = searchParams.get(section);
    if (paramValue) {
      const values = paramValue.split(",");
      groupedFilters.push({ section, values });
    }
  };

  addFilterGroup("category");
  addFilterGroup("subCategory");
  addFilterGroup("brand");
  addFilterGroup("sizes");
  addFilterGroup("colors");

  // Price is special - only show if different from default [0, 2000]
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const hasPriceFilter = (minPrice && minPrice !== "0") || (maxPrice && maxPrice !== "2000");

  if (groupedFilters.length === 0 && !hasPriceFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Price Chip */}
      {hasPriceFilter && (
        <Badge variant="secondary" className="h-7 rounded-full px-2.5 py-0.5 text-xs font-normal gap-1 border border-border">
          <span>
            ${minPrice || 0} - ${maxPrice || 2000}
          </span>
          <X
            className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors ml-0.5"
            onClick={removePriceFilter}
          />
        </Badge>
      )}

      {/* Individual Filter Chips */}
      {groupedFilters.map((group) => (
        <Fragment key={group.section}>
          {group.values.map((val) => (
            <Badge key={`${group.section}-${val}`} variant="secondary" className="h-7 rounded-full px-2.5 py-0.5 text-xs font-normal gap-1 border border-border">
              <span className="capitalize">{val}</span>
              <X
                className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors ml-0.5"
                onClick={() => removeFilter(group.section, val)}
              />
            </Badge>
          ))}
        </Fragment>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAll}
        className="gap-1 rounded-full text-xs h-7 text-muted-foreground hover:text-destructive px-2"
      >
        Clear All
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
