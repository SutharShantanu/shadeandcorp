"use client";

import React, { Fragment } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, User, Shirt, DollarSign, Palette, Ruler, Hash, Tag, EllipsisVertical, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "White", value: "#FFFFFF", ring: "ring-zinc-200" },
  { name: "Black", value: "#000000", ring: "ring-primary" },
  { name: "Red", value: "#EF4444", ring: "ring-red-500" },
  { name: "Blue", value: "#3B82F6", ring: "ring-blue-500" },
  { name: "Green", value: "#22C55E", ring: "ring-green-500" },
  { name: "Yellow", value: "#EAB308", ring: "ring-yellow-500" },
  { name: "Orange", value: "#F97316", ring: "ring-orange-500" },
  { name: "Purple", value: "#A855F7", ring: "ring-purple-500" },
  { name: "Pink", value: "#EC4899", ring: "ring-pink-500" },
];

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
  const groupedFilters: { section: string; icon: React.ReactNode; values: string[] }[] = [];

  const addFilterGroup = (section: string, icon: React.ReactNode) => {
    const paramValue = searchParams.get(section);
    if (paramValue) {
      const values = paramValue.split(",");
      groupedFilters.push({ section, icon, values });
    }
  };

  addFilterGroup("category", <User className="w-3.5 h-3.5" />);
  addFilterGroup("subCategory", <Shirt className="w-3.5 h-3.5" />);
  addFilterGroup("brand", <Hash className="w-3.5 h-3.5" />);
  addFilterGroup("sizes", <Ruler className="w-3.5 h-3.5" />);
  addFilterGroup("colors", <Palette className="w-3.5 h-3.5" />);

  // Price is special - only show if different from default [0, 2000]
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const hasPriceFilter = (minPrice && minPrice !== "0") || (maxPrice && maxPrice !== "2000");

  if (groupedFilters.length === 0 && !hasPriceFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Price Chip */}
      {hasPriceFilter && (
        <Badge variant="secondary" className="pl-0 gap-0 h-8 rounded-full overflow-hidden p-0">
          <div className="py-1 px-2 h-full flex items-center justify-center text-muted-foreground bg-primary-foreground">
            <DollarSign className="size-3.5" />
          </div>
          <div className="px-2 flex items-center gap-1.5 text-xs font-medium h-full">
            <span>
              ${minPrice || 0} - ${maxPrice || 2000}
            </span>
            <X
              className="w-3 h-3 cursor-pointer hover:text-destructive"
              onClick={removePriceFilter}
            />
          </div>
        </Badge>
      )}

      {/* Individual Filter Chips */}
      {groupedFilters.map((group) => (
        <Fragment key={group.section}>
          {group.values.map((val) => (
            <Badge key={`${group.section}-${val}`} variant="secondary" className="pl-0 gap-0 h-8 rounded-full overflow-hidden p-0 border-border/50 hover:border-primary/30 transition-colors shadow-sm">
              <div className="py-1 px-2.5 h-full flex items-center justify-center text-muted-foreground bg-primary-foreground border-r border-border/10">
                {group.section === "colors" ? (
                  <div 
                    className={cn(
                      "size-3 rounded-full border shadow-sm",
                      val.toLowerCase() === "white" ? "border-zinc-200" : "border-transparent"
                    )}
                    style={{ backgroundColor: COLORS.find(c => c.name.toLowerCase() === val.toLowerCase())?.value || val }}
                  />
                ) : (
                  group.icon
                )}
              </div>
              <div className="px-2.5 flex items-center gap-1.5 text-[11px] font-semibold h-full">
                <span className="capitalize">{val}</span>
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-destructive transition-colors"
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
        <X className="size-3 hover:text-destructive" />
      </Button>
    </div>
  );
}
