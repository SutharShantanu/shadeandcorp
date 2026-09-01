"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type SlideType = {
  image: string;
  alt?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  theme?: "light" | "dark";
};

// Fashion-focused slides with compelling content
const slides: SlideType[] = [
  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=800&fit=crop",
    alt: "Summer Fashion Collection",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in warm-weather fashion",
    ctaText: "Shop Now",
    ctaLink: "/collection/summer",
    theme: "light",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    alt: "New Arrivals",
    title: "New Arrivals",
    subtitle: "Fresh styles just dropped. Be the first to shop",
    ctaText: "Explore New",
    ctaLink: "/new-arrivals",
    theme: "dark",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=1200&h=800&fit=crop",
    alt: "Seasonal Sale",
    title: "Up to 50% Off",
    subtitle: "Limited time offer on selected items",
    ctaText: "Shop Sale",
    ctaLink: "/sale",
    theme: "light",
  },
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop",
    alt: "Designer Collaboration",
    title: "Designer Collaboration",
    subtitle: "Exclusive collection with leading designers",
    ctaText: "Discover",
    ctaLink: "/designers",
    theme: "dark",
  },
];

const SLIDE_DURATION = 6000; // Slide timer duration in ms

export default function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(slides.length);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Setup plugins for shadcn Carousel
  const plugins = useMemo(() => {
    return [Fade()];
  }, []);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      elapsedRef.current = 0;
      setProgress(0);
      lastTimeRef.current = null;
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const isEffectivePlaying = isPlaying && !isHovered;

  useEffect(() => {
    if (!isEffectivePlaying || !api) {
      lastTimeRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      elapsedRef.current += delta;

      if (elapsedRef.current >= SLIDE_DURATION) {
        elapsedRef.current = 0;
        setProgress(0);
        lastTimeRef.current = null;
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      } else {
        const currentProgress = (elapsedRef.current / SLIDE_DURATION) * 100;
        setProgress(currentProgress);
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isEffectivePlaying, api]);

  const toggleAutoplay = useCallback(() => {
    if (isEffectivePlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setIsHovered(false);
    }
  }, [isEffectivePlaying]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
      if (api.selectedScrollSnap() === index) {
        elapsedRef.current = 0;
        setProgress(0);
        lastTimeRef.current = null;
      }
    },
    [api],
  );

  return (
    <motion.section
      className="relative overflow-hidden w-full h-[70vh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Shadcn Carousel Component - Full Width */}
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={plugins}
        className="h-full w-full"
      >
        <CarouselContent className="h-full -ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative w-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.alt || `slide-${index}`}
                fill
                className="object-cover object-center"
                priority={index === 0}
                sizes="100vw"
              />

              {/* Overlays for contrast and depth */}
              <div
                className={cn(
                  "absolute inset-0 bg-black/35",
                  slide.theme === "dark" && "bg-black/50",
                )}
              />
              <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />

              {/* Hero Content Overlay */}
              <div className="absolute inset-0 flex items-center z-15">
                <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 md:px-12">
                  <div className="max-w-xl text-white">
                    <motion.div
                      key={current}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-md">
                        {slide.title}
                      </h1>
                      <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-95 leading-relaxed font-normal drop-shadow-xs">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={slide.ctaLink}
                          className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 text-center text-lg shadow-xl hover:shadow-2xl active:scale-98"
                        >
                          {slide.ctaText}
                        </Link>
                        <Link
                          href="/shop-all"
                          className="border-2 border-white/80 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 text-center text-lg backdrop-blur-md bg-white/10"
                        >
                          Shop All
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Floating Navigation Arrows with Blur Depth */}
        <CarouselPrevious className="left-4 md:left-8 backdrop-blur-xl z-25 shadow-2xl transition-all size-8" />
        <CarouselNext className="right-4 md:right-8 backdrop-blur-xl z-25 shadow-2xl transition-all size-8" />
      </Carousel>

      {/* Separated Floating Control Chips (Counter, Dots, Play/Pause) with Uniform Height (h-8) */}
      <div className="absolute bottom-5 left-0 right-0 z-25 flex items-center justify-center gap-3">
        {/* Chip 1: Slide Counter */}
        <div className="h-8 touch-manipulation rounded-full bg-black/40 border-0 hover:bg-black/60 backdrop-blur-xl px-4 text-xs font-mono text-white shadow-2xl select-none transition-all ease-in-out flex items-center justify-center font-semibold overflow-hidden">
          <span>
            {String(current).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </span>
        </div>

        {/* Chip 2: Pagination Dots with Animated Progress Fill */}
        <div className="h-8 flex items-center justify-center gap-2.5 touch-manipulation rounded-full bg-black/40 border-0 hover:bg-black/60 backdrop-blur-xl px-5 shadow-2xl transition-all ease-in-out">
          {slides.map((_, index) => {
            const isActive = current - 1 === index;
            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "h-2.5 rounded-full bg-muted-foreground transition-all ease-in-out cursor-pointer focus:outline-hidden relative overflow-hidden flex items-center",
                  isActive ? "w-10" : "w-2.5 hover:bg-primary",
                )}
              >
                {isActive && (
                  <div
                    className="h-full bg-white rounded-full shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Chip 3: Autoplay Play/Pause Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAutoplay}
          aria-label={isEffectivePlaying ? "Pause autoplay" : "Start autoplay"}
          className="h-8 w-8 touch-manipulation rounded-full bg-black/40 border-0 hover:bg-black/60 hover:scale-110 backdrop-blur-xl shadow-2xl transition-all ease-in-out text-white hover:text-white p-0 shrink-0 flex items-center justify-center"
          title={isEffectivePlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isEffectivePlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4 ml-0.5" />
          )}
        </Button>
      </div>
    </motion.section>
  );
}