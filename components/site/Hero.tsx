"use client";

import React from "react";
import Image from "next/image";
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

type PropType = {
  slides: { image: string; alt?: string }[];
  options?: EmblaOptionsType;
};

const slides = [
  { image: "https://picsum.photos/1200/600?1", alt: "Slide 1" },
  { image: "https://picsum.photos/1200/600?2", alt: "Slide 2" },
  { image: "https://picsum.photos/1200/600?3", alt: "Slide 3" },
];

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  options = { loop: true },
}) => {
  const autoplayOptions = { delay: 5000, stopOnInteraction: false };
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
    <div className="embla relative overflow-hidden w-full max-w-7xl mx-auto h-[60vh]">
      <div className="embla__viewport h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="embla__slide relative flex-[0_0_100%] h-full"
            >
              <Image
                src={slide.image}
                alt={slide.alt || `slide-${index}`}
                fill
                className="object-cover rounded-2xl"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
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

      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="embla__dots flex gap-3">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Hero() {
  return (
    <motion.div
      className="relative p-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <EmblaCarousel slides={slides} />
    </motion.div>
  );
}
