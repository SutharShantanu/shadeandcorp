"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import AutoPlay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
import { DotButton, useDotButton } from "../ui/embla-carousel-dot-button";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "../ui/embla-carousel-arrow-button";

type SlideType = {
  image: string;
  alt?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  theme?: "light" | "dark";
};

type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
};

// Fashion-focused slides with compelling content
const slides: SlideType[] = [
  {
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=800&fit=crop",
    alt: "Summer Fashion Collection",
    title: "Summer Collection 2024",
    subtitle: "Discover the latest trends in warm-weather fashion",
    ctaText: "Shop Now",
    ctaLink: "/collection/summer",
    theme: "light"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
    alt: "New Arrivals",
    title: "New Arrivals",
    subtitle: "Fresh styles just dropped. Be the first to shop",
    ctaText: "Explore New",
    ctaLink: "/new-arrivals",
    theme: "dark"
  },
  {
    image: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=1200&h=800&fit=crop",
    alt: "Seasonal Sale",
    title: "Up to 50% Off",
    subtitle: "Limited time offer on selected items",
    ctaText: "Shop Sale",
    ctaLink: "/sale",
    theme: "light"
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=800&fit=crop", 
    alt: "Designer Collaboration",
    title: "Designer Collaboration",
    subtitle: "Exclusive collection with leading designers",
    ctaText: "Discover",
    ctaLink: "/designers",
    theme: "dark"
  }
];

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  options = { loop: true },
}) => {
  const autoplayOptions = { delay: 6000, stopOnInteraction: false };
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Fade(),
    AutoPlay(autoplayOptions),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="embla relative overflow-hidden w-full max-w-7xl mx-auto h-[70vh] min-h-[500px] md:h-[80vh]">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide relative flex-[0_0_100%] h-full"
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.alt || `slide-${index}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
              
              {/* Overlay for better text readability */}
              <div className={`absolute inset-0 bg-black/25 ${slide.theme === 'dark' ? 'bg-black/40' : ''}`} />
              <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/50 via-black/15 to-transparent pointer-events-none z-10" />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-8">
                  <div className={`max-w-lg ${
                    slide.theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={slide.ctaLink}
                          className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300 text-center text-lg"
                        >
                          {slide.ctaText}
                        </Link>
                        <Link
                          href="/shop-all"
                          className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 text-center text-lg"
                        >
                          Shop All
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            enabled={!prevBtnDisabled}
          />
        </div>
        <div className="pointer-events-auto">
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            enabled={!nextBtnDisabled}
          />
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="embla__dots flex gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-center">
            <div>
              <p className="font-semibold text-lg">Free Shipping</p>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Easy Returns</p>
              <p className="text-sm text-gray-600">30-day policy</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Secure Payment</p>
              <p className="text-sm text-gray-600">100% protected</p>
            </div>
            <div>
              <p className="font-semibold text-lg">24/7 Support</p>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Hero() {
  return (
    <motion.section
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <EmblaCarousel slides={slides} />
    </motion.section>
  );
}