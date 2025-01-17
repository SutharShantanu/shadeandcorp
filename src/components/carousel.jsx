"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Fade from "embla-carousel-fade";
import ClassNames from "embla-carousel-class-names";
import AutoHeightPlugin from "embla-carousel-auto-height";
import AutoScrollPlugin from "embla-carousel-auto-scroll";
import { CircleArrowLeft, CircleArrowRight, CirclePause, CirclePlay } from "lucide-react";
import { Button } from "./ui/button";

const Carousel = ({
    slides = [],
    options = {},
    plugins = [],
    showIndicators = true,
    showNavigation = true,
    showStartStop = true,
    stopOnMouseEnter = false,
    autoplayOptions = { delay: 4000 },
    autoHeight = false,
    autoScrollOptions = { speed: 2 },
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        WheelGesturesPlugin(),
        Fade(),
        ClassNames(),
        ...(autoHeight ? [AutoHeightPlugin()] : []),
        ...(autoplayOptions ? [AutoplayPlugin(autoplayOptions)] : []),
        ...(autoScrollOptions ? [AutoScrollPlugin(autoScrollOptions)] : []),
        ...plugins,
    ]);

    const [isPlaying, setIsPlaying] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index) => emblaApi?.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    const startAutoplay = useCallback(() => {
        if (emblaApi?.plugins()?.autoplay) {
            emblaApi.plugins().autoplay.play();
            setIsPlaying(true);
        }
    }, [emblaApi]);

    const stopAutoplay = useCallback(() => {
        if (emblaApi?.plugins()?.autoplay) {
            emblaApi.plugins().autoplay.stop();
            setIsPlaying(false);
        }
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        return () => emblaApi.off("select", onSelect);
    }, [emblaApi, onSelect]);

    if (!Array.isArray(slides) || slides.length === 0) {
        console.error("Carousel: `slides` must be a non-empty array of React elements.");
        return null;
    }

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => stopOnMouseEnter && stopAutoplay()}
            onMouseLeave={() => stopOnMouseEnter && startAutoplay()}
        >
            <div className="embla__viewport overflow-hidden w-full" ref={emblaRef}>
                <div className="embla__container flex  h-[500px]!">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="embla__slide flex-[0_0_100%] transition-all duration-500"
                        >
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && (
                <div>
                    <button
                        onClick={scrollPrev}
                        className="absolute right-14 bottom-5 bg-transprent hover:shadow-sm hover:scale-95 transition-all ease-in-out text-primary-foreground rounded-full"
                    >
                        <CircleArrowLeft size={34} strokeWidth={1.5} absoluteStrokeWidth />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-5 bottom-5 bg-transprent hover:shadow-sm hover:scale-95 transition-all ease-in-out text-primary-foreground rounded-full"
                    >
                        <CircleArrowRight size={34} strokeWidth={1.5} absoluteStrokeWidth />
                    </button>
                </div>
            )}

            {showIndicators && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-3 h-1 rounded-full transition-all ease-in-out ${selectedIndex === index ? "bg-primary-default" : "bg-primary-foreground"
                                }`}
                        ></button>
                    ))}
                </div>
            )}

            {showStartStop && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                        onClick={startAutoplay}
                        disabled={isPlaying}
                        className={`bg-black rounded-full ${isPlaying ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        <CirclePlay size={34} strokeWidth={1.5} absoluteStrokeWidth />
                    </Button>
                    <Button
                        onClick={stopAutoplay}
                        disabled={!isPlaying}
                        className={`bg-black rounded-full ${!isPlaying ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        <CirclePause size={34} strokeWidth={1.5} absoluteStrokeWidth />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Carousel;
