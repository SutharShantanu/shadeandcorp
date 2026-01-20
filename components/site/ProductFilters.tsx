"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X, Search, Mars, Venus, Layers, DollarSign, Palette, Ruler, Tag, Transgender, Baby, CircleSmall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/ui/icon-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SizeChart } from "@/components/ui/size-chart";

const CATEGORIES = ["Men", "Women", "Unisex", "Kids"];
const SUB_CATEGORIES = ["T-Shirts", "Jeans", "Dresses", "Shoes", "Accessories"];
const BRANDS = ["Nike", "Adidas", "Puma", "Reebok", "Zara", "H&M", "Gucci", "Prada", "Versace", "Under Armour"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
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

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [brandSearch, setBrandSearch] = useState("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Determine if we should show the gender filter
  const showGenderFilter = pathname === "/products" || !!searchParams.get("search");

  // Sync state with URL
  useEffect(() => {
    const min = Number(searchParams.get("minPrice")) || 0;
    const max = Number(searchParams.get("maxPrice")) || 2000;
    setPriceRange([min, max]);
  }, [searchParams]);

  const updateFilter = (section: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(section)?.split(",") || [];

    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    if (newValues.length > 0) {
      params.set(section, newValues.join(","));
    } else {
      params.delete(section);
    }

    // Reset page on filter change
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const updatePrice = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceInputChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    const newRange = [...priceRange];
    newRange[index] = newValue;
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isChecked = (section: string, value: string) => {
    const params = searchParams.get(section)?.split(",") || [];
    return params.includes(value);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const removeFilter = (section: string, value: string) => {
    updateFilter(section, value, false);
  };

  // Get all active filters for chips
  const activeFilters: { section: string; value: string; label: string }[] = [];
  ["category", "subCategory", "brand", "sizes", "colors"].forEach(section => {
    const values = searchParams.get(section)?.split(",") || [];
    values.forEach(val => {
      activeFilters.push({ section, value: val, label: val });
    });
  });

  const filteredBrands = BRANDS.filter(brand =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const getSectionFilterCount = (section: string) => {
    return searchParams.get(section)?.split(",").filter(Boolean).length || 0;
  };

  const FilterIndicator = ({ count }: { count: number }) => {
    if (count === 0) return null;
    return (
      <Badge variant="default" className="ml-2 p-1 text-xs font-semibold size-4.5">
        {count}
      </Badge>
    );
  };

  const SectionHeader = ({
    label,
    icon,
    countKey,
    isPrice = false
  }: {
    label: string,
    icon: React.ReactNode,
    countKey?: string,
    isPrice?: boolean
  }) => {
    const count = countKey ? getSectionFilterCount(countKey) : 0;
    const hasPriceFilter = isPrice && (searchParams.get("minPrice") || searchParams.get("maxPrice"));

    return (
      <div className="flex gap-2 items-center">
        <IconBadge variant="default" size="md">
          {icon}
        </IconBadge>
        <div className="flex items-center">
          {label}
          <FilterIndicator count={count} />
          {hasPriceFilter && !count && (
            <Badge variant="default" className="ml-2 size-3 p-0" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 border border-border p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {activeFilters.length > 0 && (
          <Button variant="secondary" size="sm" onClick={clearFilters} className="gap-1 rounded-full text-xs">
            Clear
            <X className="size-3 hover:text-destructive" />
          </Button>
        )}
      </div>

      <Separator className="mb-0" />

      <Accordion type="multiple" defaultValue={["category", "price", "brand", "size", "color"]} className="w-full">
        {showGenderFilter && (
          <div id="filter-section-category">
            <AccordionItem value="category">
              <AccordionTrigger className="text-sm">
                <SectionHeader
                  label="Gender"
                  icon={searchParams.get("category") === "Women" ? <Venus className="size-3.5" /> : searchParams.get("category") === "Men" ? <Mars className="size-3.5" /> : searchParams.get("category") === "Unisex" ? <Transgender className="size-3.5" /> : searchParams.get("category") === "Kids" ? <Baby className="size-3.5" /> : <CircleSmall className="size-3.5" />}
                  countKey="category"
                />
              </AccordionTrigger>
              <AccordionContent className="py-2">
                <div className="space-y-3">
                  {CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={isChecked("category", cat)}
                        onCheckedChange={(checked) => updateFilter("category", cat, checked as boolean)}
                        className="cursor-pointer"
                      />
                      <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer w-full">
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        )}

        <div id="filter-section-subCategory">
          <AccordionItem value="subCategory">
            <AccordionTrigger className="text-sm">
              <SectionHeader
                label="Category"
                icon={<Layers className="size-3.5" />}
                countKey="subCategory"
              />
            </AccordionTrigger>
            <AccordionContent className="py-2">
              <div className="space-y-3">
                {SUB_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-${cat}`}
                      checked={isChecked("subCategory", cat)}
                      onCheckedChange={(checked) => updateFilter("subCategory", cat, checked as boolean)}
                      className="cursor-pointer"
                    />
                    <Label htmlFor={`sub-${cat}`} className="text-sm font-normal cursor-pointer w-full">
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Price */}
        <div id="filter-section-price">
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm">
              <SectionHeader
                label="Price Range"
                icon={<DollarSign className="size-3.5" />}
                isPrice
              />
            </AccordionTrigger>
            <AccordionContent className="">
              <div className="space-y-4 py-3 px-1">
                <Slider
                  defaultValue={[0, 2000]}
                  value={priceRange}
                  max={2000}
                  step={10}
                  onValueChange={updatePrice}
                  onValueCommit={applyPriceFilter}
                />
              </div>
              <div className="flex flex-row items-center gap-2 px-1 mt-1 justify-between">
                <Input
                  type="number"
                  min={0}
                  max={2000}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                  onBlur={applyPriceFilter}
                  className="text-sm max-w-1/2"
                />
                <Input
                  type="number"
                  min={0}
                  max={2000}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                  onBlur={applyPriceFilter}
                  className="text-sm max-w-1/2"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Colors */}
        <div id="filter-section-colors">
          <AccordionItem value="color">
            <AccordionTrigger className="text-sm ">
              <SectionHeader
                label="Color"
                icon={<Palette className="size-3.5" />}
                countKey="colors"
              />
            </AccordionTrigger>
            <AccordionContent className="p-2" >
              <div className="flex flex-wrap gap-2 pt-2">
                {COLORS.map((color) => (
                  <div
                    key={color.name}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                    onClick={() => updateFilter("colors", color.name, !isChecked("colors", color.name))}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full border shadow-sm flex items-center justify-center transition-all",
                      color.name === "White" ? "bg-white" : "",
                      isChecked("colors", color.name) ? `ring-2 ring-offset-2 ${color.ring}` : "hover:ring-1 hover:ring-zinc-300"
                    )}
                      style={{ backgroundColor: color.value }}
                    >
                      {isChecked("colors", color.name) && (
                        <div className={cn("w-2 h-2 rounded-full bg-white", color.name === "White" ? "bg-black" : "")} />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground">{color.name}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Size */}
        <div id="filter-section-sizes">
          <AccordionItem value="size">
            <AccordionTrigger className="text-sm ">
              <SectionHeader
                label="Size"
                icon={<Ruler className="size-3.5" />}
                countKey="sizes"
              />
            </AccordionTrigger>
            <AccordionContent className="py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Select Size</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSizeGuideOpen(true);
                  }}
                  className="text-[10px] flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <Ruler className="size-2.5" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((size) => (
                  <div
                    key={size}
                    className={cn(
                      "flex items-center justify-center border rounded-md py-2 cursor-pointer text-sm hover:border-primary transition-colors",
                      isChecked("sizes", size) ? "bg-primary text-primary-foreground border-primary" : "bg-background"
                    )}
                    onClick={() => updateFilter("sizes", size, !isChecked("sizes", size))}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Brand */}
        <div id="filter-section-brand">
          <AccordionItem className="last:border-b-0" value="brand">
            <AccordionTrigger className="text-sm ">
              <SectionHeader
                label="Brand"
                icon={<Tag className="size-3.5" />}
                countKey="brand"
              />
            </AccordionTrigger>
            <AccordionContent className="py-2">
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search brands..."
                    className="pl-9 h-9"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {filteredBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={isChecked("brand", brand)}
                        onCheckedChange={(checked) => updateFilter("brand", brand, checked as boolean)}
                        className="cursor-pointer"
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer w-full">
                        {brand}
                      </Label>
                    </div>
                  ))}
                  {filteredBrands.length === 0 && (
                    <p className="text-sm text-muted-foreground py-2 text-center">No brands found</p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>

      <Dialog open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Size Guide</DialogTitle>
          </DialogHeader>
          <SizeChart />
        </DialogContent>
      </Dialog>
    </div>
  );
}
