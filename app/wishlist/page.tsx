"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Trash2,
  Grid,
  List as ListIcon,
  Sparkles,
  Folder,
  Search,
  Tag,
  Share2,
  ShoppingBag,
  X,
  RotateCcw,
  Copy,
  CheckCircle2,
  TrendingDown,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  remove,
  clear,
  hydrate,
  setSampleItems,
  WishlistItem,
} from "@/features/wishlist/wishlistSlice";
import { SAMPLE_WISHLIST_ITEMS } from "@/lib/data/sampleWishlist";
import { Product } from "@/types/ProductCard";
import ProductCard from "@/components/site/ProductCard";
import { useDebounce } from "@/hooks/use-debounce";

import {
  Filters,
  Filter,
  FilterFieldConfig,
  createFilter,
} from "@/components/ui/filters";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// Helper to compute Price Drop info for an item
function getPriceDropInfo(item: WishlistItem) {
  const currentPrice = item.variants?.[0]?.price || item.basePrice || 0;
  const originalPrice =
    item.addedPrice ||
    item.variants?.[0]?.originalPrice ||
    (item.variants?.[0]?.discount
      ? currentPrice / (1 - item.variants[0].discount / 100)
      : 0);

  const drop = Math.round(originalPrice - currentPrice);
  const percent =
    originalPrice > 0 ? Math.round((drop / originalPrice) * 100) : 0;

  return {
    hasDrop: drop > 0,
    dropAmount: drop,
    dropPercent: percent,
    currentPrice,
    originalPrice,
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [sort, setSort] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Share Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // Populate sample items on first initial empty load
  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("wishlist") : null;
    if (!raw && items.length === 0) {
      dispatch(setSampleItems(SAMPLE_WISHLIST_ITEMS));
    }
  }, [dispatch, items.length]);

  // Dynamic Category / Collections with counts
  const categoryFolders = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((item) => {
      const cat = item.subCategory || item.category || "General";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [items]);

  // Configure ReUI Filter Fields definition
  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "category",
        label: "Category / Collection",
        icon: <Folder className="h-3.5 w-3.5 text-amber-500" />,
        type: "multiselect",
        options: categoryFolders.map((folder) => ({
          value: folder.name,
          label: `${folder.name} (${folder.count})`,
        })),
      },
      {
        key: "price_drop",
        label: "Price Drop",
        icon: <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />,
        type: "select",
        options: [
          { value: "yes", label: "Price Dropped Only" },
          { value: "no", label: "No Price Drop" },
        ],
      },
      {
        key: "on_sale",
        label: "Sale & Discounts",
        icon: <Tag className="h-3.5 w-3.5 text-rose-500" />,
        type: "select",
        options: [
          { value: "yes", label: "On Sale Only" },
          { value: "no", label: "Regular Price" },
        ],
      },
      {
        key: "stock",
        label: "Stock Availability",
        icon: <Package className="h-3.5 w-3.5 text-blue-500" />,
        type: "select",
        options: [
          { value: "in_stock", label: "In Stock Only" },
          { value: "out_of_stock", label: "Out of Stock" },
        ],
      },
    ],
    [categoryFolders]
  );

  // Price Drop Analytics
  const priceDroppedItems = useMemo(() => {
    return items.filter((item) => getPriceDropInfo(item).hasDrop);
  }, [items]);

  const totalSavingsAmount = useMemo(() => {
    return priceDroppedItems.reduce(
      (acc, item) => acc + getPriceDropInfo(item).dropAmount,
      0
    );
  }, [priceDroppedItems]);

  // Filter & Sort Items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search query filter with debounce
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.brand?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.subCategory?.toLowerCase().includes(query)
      );
    }

    // Apply ReUI Filters
    activeFilters.forEach((filter) => {
      if (filter.field === "price_drop") {
        const val = filter.values[0];
        if (val === "yes") {
          result = result.filter((item) => getPriceDropInfo(item).hasDrop);
        } else if (val === "no") {
          result = result.filter((item) => !getPriceDropInfo(item).hasDrop);
        }
      }

      if (filter.field === "on_sale") {
        const val = filter.values[0];
        if (val === "yes") {
          result = result.filter(
            (item) =>
              item.isOnSale ||
              item.variants?.some((v) => (v.discount || 0) > 0)
          );
        } else if (val === "no") {
          result = result.filter(
            (item) =>
              !item.isOnSale &&
              !item.variants?.some((v) => (v.discount || 0) > 0)
          );
        }
      }

      if (filter.field === "stock") {
        const val = filter.values[0];
        if (val === "in_stock") {
          result = result.filter((item) => {
            const stock =
              item.variants?.reduce(
                (acc, v) => acc + (v.stockQuantity || 0),
                0
              ) ?? 0;
            return stock > 0;
          });
        } else if (val === "out_of_stock") {
          result = result.filter((item) => {
            const stock =
              item.variants?.reduce(
                (acc, v) => acc + (v.stockQuantity || 0),
                0
              ) ?? 0;
            return stock === 0;
          });
        }
      }

      if (filter.field === "category") {
        if (filter.values && filter.values.length > 0) {
          const selectedCats = new Set(filter.values);
          result = result.filter((item) => {
            const cat = item.subCategory || item.category || "General";
            return selectedCats.has(cat);
          });
        }
      }
    });

    // Sorting
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case "price-drop":
        result.sort(
          (a, b) =>
            getPriceDropInfo(b).dropAmount - getPriceDropInfo(a).dropAmount
        );
        break;
      case "discount":
        result.sort((a, b) => {
          const discA = Math.max(
            ...(a.variants?.map((v) => v.discount || 0) || [0])
          );
          const discB = Math.max(
            ...(b.variants?.map((v) => v.discount || 0) || [0])
          );
          return discB - discA;
        });
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "recent":
      default:
        result.sort((a, b) => {
          const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
          const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [items, debouncedSearchQuery, activeFilters, sort]);

  const activeFiltersCount = useMemo(() => {
    let count = activeFilters.length;
    if (debouncedSearchQuery.trim()) count++;
    return count;
  }, [debouncedSearchQuery, activeFilters.length]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilters([]);
    setSort("recent");
  };

  const handleRemove = (id: string, title?: string) => {
    dispatch(remove(id));
    toast.info(`${title || "Item"} removed from wishlist`);
  };

  const handleClearAll = () => {
    dispatch(clear());
    toast.info("Wishlist cleared");
  };

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://shadeandcorp.com/wishlist";
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success("Wishlist link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleMoveAllToBag = () => {
    const inStockItems = filteredAndSortedItems.filter((item) => {
      const stock =
        item.variants?.reduce(
          (acc, v) => acc + (v.stockQuantity || 0),
          0
        ) ?? 0;
      return stock > 0;
    });

    if (inStockItems.length === 0) {
      toast.error("No in-stock items available to move to bag.");
      return;
    }

    toast.success(
      `Moved ${inStockItems.length} in-stock ${inStockItems.length === 1 ? "item" : "items"} to your bag!`,
      {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      }
    );
  };

  const handleViewPriceDrops = () => {
    const existing = activeFilters.filter((f) => f.field !== "price_drop");
    setActiveFilters([...existing, createFilter("price_drop", "is", ["yes"])]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Wishlist Count Badge and User Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              My Wishlist
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </Badge>
          </div>

          {items.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Share Wishlist CTA */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="rounded-full text-xs h-8 gap-1.5 cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>

              {/* Move All to Bag CTA */}
              <Button
                size="sm"
                onClick={handleMoveAllToBag}
                className="rounded-full text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Move All to Bag</span>
              </Button>

              {/* Clear All Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs text-muted-foreground hover:text-destructive h-8 gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear your wishlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all {items.length} saved items from your
                      wishlist.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-6">
            {/* Price Drop Notification Banner */}
            {priceDroppedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">
                        Price Drops Detected!
                      </span>
                      <Badge className="bg-emerald-600 text-white text-tiny px-2 py-0.5 rounded-full font-bold">
                        Save ${totalSavingsAmount}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {priceDroppedItems.length}{" "}
                      {priceDroppedItems.length === 1 ? "item" : "items"} in
                      your wishlist dropped in price since you saved them.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewPriceDrops}
                  className="rounded-full text-xs h-8 shrink-0 gap-1.5 cursor-pointer"
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>View Price Drops ({priceDroppedItems.length})</span>
                </Button>
              </motion.div>
            )}

            {/* ReUI Radix Filters & Search Toolbar */}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-2xs space-y-3.5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search in Wishlist with InputGroup */}
                <div className="flex-1 max-w-sm">
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs"
                    />
                    {searchQuery && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setSearchQuery("")}
                          className="cursor-pointer text-muted-foreground hover:text-foreground"
                          aria-label="Clear search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </div>

                {/* Sort & View Mode */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Sort Dropdown */}
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-fit text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent" className="text-xs">
                        Recently Added
                      </SelectItem>
                      <SelectItem value="price-drop" className="text-xs">
                        Biggest Price Drop
                      </SelectItem>
                      <SelectItem value="price-asc" className="text-xs">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-desc" className="text-xs">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="discount" className="text-xs">
                        Highest Discount
                      </SelectItem>
                      <SelectItem value="rating" className="text-xs">
                        Top Rated
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) => {
                      if (value) setViewMode(value as "grid" | "list");
                    }}
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                  >
                    <ToggleGroupItem
                      value="grid"
                      aria-label="Grid View"
                      className="h-8.5 px-2.5 cursor-pointer"
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="list"
                      aria-label="List View"
                      className="h-8.5 px-2.5 cursor-pointer"
                    >
                      <ListIcon className="h-3.5 w-3.5" />
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {/* Reset Filters Link */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="text-xs text-muted-foreground hover:text-foreground h-8.5 gap-1 px-2.5 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset ({activeFiltersCount})</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* ReUI Radix Filters Component */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground mr-1">
                  Filters:
                </span>
                <Filters
                  fields={filterFields}
                  filters={activeFilters}
                  onChange={setActiveFilters}
                  size="sm"
                  variant="default"
                />
              </div>
            </div>

            {/* Product Cards: Grid or List View */}
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-16 px-4 bg-card rounded-2xl border border-border shadow-2xs max-w-lg mx-auto">
                <div className="h-12 w-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  No matching products found
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Try adjusting your search term, clearing category filters, or
                  resetting your filter pills.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-full text-xs gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Filters</span>
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedItems.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard
                        product={product}
                        layout="grid"
                        onAddToWishlist={() =>
                          handleRemove(product.id, product.title)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {filteredAndSortedItems.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard
                        product={product}
                        layout="list"
                        onAddToWishlist={() =>
                          handleRemove(product.id, product.title)
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              Save items you love by tapping the heart icon on any product card
              while browsing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full px-6 shadow-xs">
                <Link href="/products">Explore Products</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => dispatch(setSampleItems(SAMPLE_WISHLIST_ITEMS))}
                className="rounded-full text-xs gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Load Sample Items
              </Button>
            </div>
          </div>
        )}

        {/* Share Wishlist Modal */}
        <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                <span>Share Your Wishlist</span>
              </DialogTitle>
              <DialogDescription>
                Share your curated wishlist with friends, family, or for gift
                registries.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? window.location.href
                      : "https://shadeandcorp.com/wishlist"
                  }
                  className="text-xs font-mono bg-muted/50"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0 gap-1.5"
                >
                  {isCopied ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full rounded-lg"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
