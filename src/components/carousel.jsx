"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Fade from "embla-carousel-fade";
import ClassNames from "embla-carousel-class-names";
import AutoHeightPlugin from "embla-carousel-auto-height";
import AutoScrollPlugin from "embla-carousel-auto-scroll";
import { CheckCircle, CircleArrowLeft, CircleArrowRight, CircleDot, CirclePause, CirclePlay, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
    const autoplay = AutoplayPlugin(autoplayOptions); // Autoplay instance

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        WheelGesturesPlugin(),
        Fade(),
        ClassNames(),
        ...(autoHeight ? [AutoHeightPlugin()] : []),
        AutoScrollPlugin(autoScrollOptions),
        autoplay, // Ensure autoplay is always added
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

        // Start autoplay immediately
        startAutoplay();

        return () => {
            emblaApi.off("select", onSelect);
            stopAutoplay(); // Stop autoplay on unmount
        };
    }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

    if (!Array.isArray(slides) || slides.length === 0) {
        console.error("Carousel: `slides` must be a non-empty array of React elements.");
        return null;
    }

    return (
        <motion.div
            className="relative w-full"
            onMouseEnter={() => stopOnMouseEnter && stopAutoplay()}
            onMouseLeave={() => stopOnMouseEnter && startAutoplay()}
        >
            <CarouselViewport emblaRef={emblaRef} slides={slides} />
            {showNavigation && <CarouselNavigation scrollPrev={scrollPrev} scrollNext={scrollNext} />}
            {showIndicators && <CarouselIndicators slides={slides} scrollTo={scrollTo} selectedIndex={selectedIndex} />}
            {showStartStop && <CarouselControls isPlaying={isPlaying} toggleAutoplay={isPlaying ? stopAutoplay : startAutoplay} />}
        </motion.div>
    );
};

const CarouselViewport = ({ emblaRef, slides }) => (
    <motion.div className="embla__viewport overflow-hidden w-full rounded-xs" ref={emblaRef}>
        <motion.div className="embla__container flex h-[500px]">
            {slides.map((slide, index) => (
                <motion.div key={index} className="embla__slide flex-[0_0_100%] transition-all duration-300">
                    {slide}
                </motion.div>
            ))}
        </motion.div>
    </motion.div>
);

const NavButton = ({ onClick, label, icon: Icon, className }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                size="icon"
                onClick={onClick}
                className={`absolute bottom-5 text-primary-foreground cursor-pointer p-2 h-8 w-8 bg-primary-default/20 hover:scale-95 rounded-full ${className}`}
            >
                <Icon strokeWidth={1.5} absoluteStrokeWidth />
            </Button>
        </TooltipTrigger>
        <TooltipContent>{label}<TooltipArrow /></TooltipContent>
    </Tooltip>
);

const CarouselNavigation = ({ scrollPrev, scrollNext }) => (
    <TooltipProvider>
        <motion.div>
            <NavButton onClick={scrollPrev} label="Previous" icon={CircleArrowLeft} className="right-14" />
            <NavButton onClick={scrollNext} label="Next" icon={CircleArrowRight} className="right-5" />
        </motion.div>
    </TooltipProvider>
);

const CarouselIndicators = ({ slides, scrollTo, selectedIndex }) => (
    <motion.div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
            <Button
                key={index}
                size="icon"
                onClick={() => scrollTo(index)}
                className={`w-2 h-1 p-0 cursor-pointer rounded-full transition-all ${selectedIndex === index ? "bg-primary-default" : "bg-primary-foreground"}`}
            ></Button>
        ))}
    </motion.div>
);


const CarouselControls = ({ isPlaying, toggleAutoplay }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div className="absolute bottom-4 left-4 flex gap-2">
                    <Button
                        onClick={toggleAutoplay}
                        size="icon"
                        className="bg-primary-default/20 hover:scale-95 rounded-full p-2 h-8 w-8 cursor-pointer"
                    >
                        {isPlaying ? (
                            <CirclePause strokeWidth={1.5} absoluteStrokeWidth />
                        ) : (
                            <CirclePlay strokeWidth={1.5} absoluteStrokeWidth />
                        )}
                    </Button>
                </motion.div>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
                {isPlaying ? (
                    <motion.div className="flex items-center gap-1">
                        <span>Playing</span>
                        <CircleDot strokeWidth={1.5} absoluteStrokeWidth className="text-chart-2 animate-pulse w-3 fill-chart-2" />
                    </motion.div>
                ) : (
                    <motion.div className="flex items-center gap-2">
                        <span>Paused</span>
                        <CircleDot strokeWidth={1.5} absoluteStrokeWidth className="text-destructive-default animate-pulse w-3 fill-destructive-default" />
                    </motion.div>
                )}
                <TooltipArrow />
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


export default Carousel;
