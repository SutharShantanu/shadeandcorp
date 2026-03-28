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
        <Badge variant="destructive" className="h-8 rounded-full">
          <div className="flex items-center gap-1 text-xs h-full">
            <span>
              ${minPrice || 0} - ${maxPrice || 2000}
            </span>
            <X
              className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors ml-1"
              onClick={removePriceFilter}
            />
          </div>
        </Badge>
      )}

      {/* Individual Filter Chips */}
      {groupedFilters.map((group) => (
        <Fragment key={group.section}>
          {group.values.map((val) => (
            <Badge key={`${group.section}-${val}`} variant="destructive" className="h-8 rounded-full">
              <div className="flex items-center gap-1 text-xs h-full">
                <span className="capitalize">{val}</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors ml-1"
                  onClick={() => removeFilter(group.section, val)}
                />
              </div>
            </Badge>
          ))}
        </Fragment>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={clearAll}
        className="gap-1 rounded-full text-xs h-8"
      >
        Clear All
        <X className="size-4 hover:text-destructive" />
      </Button>
    </div>
  );
}
