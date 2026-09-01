"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/site/SectionHeader";
import SectionCtaButton from "@/components/site/SectionCtaButton";
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryType = {
  id: string;
  name: string;
  tag: string;
  image: string;
  description: string;
  link: string;
  itemsCount?: number;
  isNew?: boolean;
  isTrending?: boolean;
  discount?: string;
};

const categoriesData: CategoryType[] = [
  {
    id: "1",
    name: "Men's Clothing",
    tag: "mens",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=800&fit=crop",
    description: "Contemporary styles for modern men",
    link: "/category/mens",
    itemsCount: 1247,
    isTrending: true,
    discount: "UP TO 40% OFF",
  },
  {
    id: "2",
    name: "Women's Fashion",
    tag: "womens",
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&h=800&fit=crop",
    description: "Trend-setting pieces for every occasion",
    link: "/category/womens",
    itemsCount: 2156,
    isTrending: true,
    discount: "NEW ARRIVALS",
  },
  {
    id: "3",
    name: "Accessories",
    tag: "accessories",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=600&h=800&fit=crop",
    description: "Complete your look with our accessories",
    link: "/category/accessories",
    itemsCount: 843,
    isNew: true,
  },
  {
    id: "4",
    name: "Footwear",
    tag: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop",
    description: "Step out in style with our shoe collection",
    link: "/category/footwear",
    itemsCount: 692,
    discount: "FLAT 30% OFF",
  },
  {
    id: "5",
    name: "Summer Collection",
    tag: "seasonal",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=800&fit=crop",
    description: "Light and breezy styles for warm days",
    link: "/collection/summer",
    itemsCount: 534,
    isNew: true,
  },
  {
    id: "6",
    name: "Winter Wear",
    tag: "seasonal",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop",
    description: "Stay warm and stylish",
    link: "/collection/winter",
    itemsCount: 387,
    isTrending: true,
  },
];

const categoryTabs = [
  { id: "all", label: "All Categories" },
  { id: "mens", label: "Men's Clothing" },
  { id: "womens", label: "Women's Fashion" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
  { id: "seasonal", label: "Seasonal Collections" },
];

const CategoryCard: React.FC<{ category: CategoryType }> = ({ category }) => {
  return (
    <Card className="overflow-hidden border border-border/50 hover:border-foreground/20 shadow-xs hover:shadow-xl transition-all duration-500 rounded-3xl bg-card text-card-foreground h-full group">
      <Link href={category.link} className="block relative h-full">
        <div className="relative aspect-4/5 overflow-hidden">
          {/* Background Image */}
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Glassmorphic Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />

          {/* Glassmorphic Badges - Top Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {category.discount && (
              <Badge className="bg-destructive/90 backdrop-blur-md text-destructive-foreground border border-white/20 px-3 py-1 text-xs font-bold shadow-md">
                {category.discount}
              </Badge>
            )}
            {category.isNew && (
              <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border border-white/20 px-3 py-1 text-xs font-bold shadow-md">
                NEW
              </Badge>
            )}
            {category.isTrending && !category.discount && !category.isNew && (
              <Badge className="bg-emerald-600/90 backdrop-blur-md text-white border border-white/20 px-3 py-1 text-xs font-bold shadow-md">
                TRENDING
              </Badge>
            )}
          </div>

          {/* Items Count Badge - Top Right */}
          {category.itemsCount && (
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant="secondary"
                className="bg-background/80 dark:bg-background/90 backdrop-blur-md text-foreground border border-border/50 px-2.5 py-1 text-xs font-mono shadow-xs"
              >
                {category.itemsCount.toLocaleString()}+ items
              </Badge>
            </div>
          )}

          {/* Center Shop Now Overlay on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button
                size="default"
                className="bg-background/90 text-foreground backdrop-blur-md hover:bg-background font-semibold rounded-full px-6 shadow-xl border border-border/40"
              >
                Shop Now
              </Button>
            </div>
          </div>

          {/* Text Overlay at Card Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
            <h3 className="font-bold text-xl md:text-2xl mb-1 group-hover:text-primary-foreground transition-colors tracking-tight">
              {category.name}
            </h3>
            <p className="text-xs md:text-sm text-white/80 line-clamp-2 mb-3 font-normal">
              {category.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/95 group-hover:text-white transition-colors">
              <span>Explore Collection</span>
              <ArrowRight className="size-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default function ProductCategories() {
  const [activeTab, setActiveTab] = useState("all");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Setup autoplay plugin
  const autoplayPlugin = React.useMemo(() => {
    return Autoplay({
      delay: 4500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    });
  }, []);

  // Filter categories by selected tab
  const filteredCategories = React.useMemo(() => {
    if (activeTab === "all") return categoriesData;
    return categoriesData.filter((c) => c.tag === activeTab);
  }, [activeTab]);

  // Update carousel counter state on slide change
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, filteredCategories]);

  // Toggle autoplay on/off
  const toggleAutoplay = useCallback(() => {
    if (!api) return;
    const autoplayInst = api.plugins()?.autoplay;
    if (!autoplayInst) return;

    if (autoplayInst.isPlaying()) {
      autoplayInst.stop();
      setIsPlaying(false);
    } else {
      autoplayInst.play();
      setIsPlaying(true);
    }
  }, [api]);

  return (
    <section className="py-16 md:py-24 bg-muted/20 dark:bg-zinc-950/40 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badgeIcon={<Sparkles className="size-3.5 text-primary" />}
          badgeText="Explore Collections"
          title="Shop By Category"
          description="Discover curated collections inspired by the latest trends from top fashion brands"
        />

        {/* Filter Tabs & Header Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 md:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-4 py-2 text-xs md:text-sm font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Action Control Chips (Counter, Play/Pause, Navigation Arrows) */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* Slide Counter Chip */}
            {count > 0 && (
              <div className="h-9 flex items-center justify-center text-xs font-mono font-semibold px-3.5 rounded-full bg-muted text-foreground border border-border shadow-2xs select-none">
                {String(current).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </div>
            )}

            {/* Play/Pause Button Chip */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleAutoplay}
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              className="h-9 w-9 rounded-full shadow-2xs transition-transform active:scale-95 bg-muted hover:bg-muted/80 p-0 flex items-center justify-center shrink-0"
              title={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5 ml-0.5" />
              )}
            </Button>

            {/* Navigation Arrows Chip */}
            <div className="h-9 flex items-center gap-1 bg-muted px-1 rounded-full border border-border shadow-2xs">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => api?.scrollPrev()}
                disabled={!api?.canScrollPrev()}
                aria-label="Previous category slide"
                className="rounded-full size-7 p-0"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => api?.scrollNext()}
                disabled={!api?.canScrollNext()}
                aria-label="Next category slide"
                className="rounded-full size-7 p-0"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[autoplayPlugin]}
              className="w-full relative"
            >
              <CarouselContent className="-ml-4 md:-ml-6">
                {filteredCategories.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full p-0.5">
                      <CategoryCard category={category} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </motion.div>
        </AnimatePresence>

        {/* View All Categories Action */}
        <SectionCtaButton
          href="/categories"
          variant="outline"
        >
          View All Categories
        </SectionCtaButton>

        {/* Quick Style Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12 pt-8 border-t border-border/50"
        >
          {[
            { name: "Casual Wear", href: "/style/casual", count: "1.2k" },
            { name: "Formal Attire", href: "/style/formal", count: "856" },
            { name: "Sportswear", href: "/style/sports", count: "723" },
            { name: "Party Dresses", href: "/style/party", count: "634" },
            { name: "Ethnic Wear", href: "/style/ethnic", count: "945" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <span className="border-b border-transparent group-hover:border-foreground pb-0.5">
                {link.name}
              </span>
              <Badge variant="secondary" className="text-xs font-mono bg-muted">
                {link.count}
              </Badge>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
