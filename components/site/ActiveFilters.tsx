"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, User, Shirt, DollarSign, Palette, Ruler, Hash, Tag, EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // Price is special
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  if (groupedFilters.length === 0 && !minPrice && !maxPrice) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* Price Chip */}
      {(minPrice || maxPrice) && (
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

      {/* Grouped Chips */}
      {groupedFilters.map((group) => (
        <Badge key={group.section} variant="secondary" className=" gap-1 h-8 rounded-full overflow-hidden p-0">
          <div className="py-1 px-2 h-full flex items-center justify-center text-muted-foreground bg-primary-foreground">
            {group.icon}
          </div>
          <div className="flex items-center text-xs font-medium h-full gap-1">
            {group.values.slice(0, 2).map((val, idx) => (
              <div key={val} className={cn("flex items-center p-1 cursor-pointer h-full group", idx > 0 && "border-x border-border")} onClick={() => removeFilter(group.section, val)}>
                <span>{val}</span>
                <X
                  className="w-0 h-3 opacity-0 ml-0 group-hover:w-3 group-hover:opacity-100 group-hover:ml-1 transition-all ease-in-out hover:text-destructive"
                />
              </div>
            ))}
            {group.values.length > 2 && (
              <div
                className="flex items-center p-1 h-full cursor-pointer"
                onClick={() => {
                  const element = document.getElementById(`filter-section-${group.section}`);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                title="Show more"
              >
                <span title="Show more">
                  <EllipsisVertical className="w-3 h-3 hover:text-destructive" />
                </span>
              </div>
            )}
          </div>
        </Badge>
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
