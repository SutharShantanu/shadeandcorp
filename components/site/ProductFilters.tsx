"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [brandSearch, setBrandSearch] = useState("");

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
    router.push("/products");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-muted-foreground hover:text-primary">
            Clear All
            </Button>
        )}
      </div>


      
      <Separator />

      <Accordion type="multiple" defaultValue={["category", "price", "brand", "size", "color"]} className="w-full">
        {/* Gender / Category */}
        <div id="filter-section-category">
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm">Gender</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    checked={isChecked("category", cat)}
                    onCheckedChange={(checked) => updateFilter("category", cat, checked as boolean)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        </div>

        <div id="filter-section-subCategory">
        <AccordionItem value="subCategory">
            <AccordionTrigger className="text-sm">Category</AccordionTrigger>
            <AccordionContent>
                <div className="space-y-3 pt-2">
                {SUB_CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`sub-${cat}`} 
                        checked={isChecked("subCategory", cat)}
                        onCheckedChange={(checked) => updateFilter("subCategory", cat, checked as boolean)}
                    />
                    <Label htmlFor={`sub-${cat}`} className="text-sm font-normal cursor-pointer">
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
          <AccordionTrigger className="text-sm">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <Slider
                defaultValue={[0, 2000]}
                value={priceRange}
                max={2000}
                step={10}
                onValueChange={updatePrice}
                onValueCommit={applyPriceFilter}
              />
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input 
                        type="number" 
                        min={0}
                        max={2000}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceInputChange(0, e.target.value)}
                        onBlur={applyPriceFilter}
                        className="pl-6 h-8 text-sm"
                    />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <Input 
                        type="number" 
                        min={0}
                        max={2000}
                        value={priceRange[1]}
                        onChange={(e) => handlePriceInputChange(1, e.target.value)}
                        onBlur={applyPriceFilter}
                        className="pl-6 h-8 text-sm"
                    />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        </div>

        {/* Colors */}
        <div id="filter-section-colors">
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm">Color</AccordionTrigger>
          <AccordionContent>
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
          <AccordionTrigger className="text-sm">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 pt-2">
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
        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm">Brand</AccordionTrigger>
          <AccordionContent>
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
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
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
    </div>
  );
}
