"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export default function ScrollProgressBar ({
    position = "bottom-right",
    strokeSize = 2,
}) {
    const { scrollYProgress } = useScroll();

    const containerOpacity = useTransform(
        scrollYProgress,
        [0, 0.07],
        [0, 1],
        { clamp: true }
    );

    const containerScale = useTransform(
        scrollYProgress,
        [0, 0.07],
        [0.9, 1],
        {
            clamp: true,
            ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Same easing as Lenis
        }
    );

    const scrollToTop = useCallback(() => {
        if (typeof window !== 'undefined' && window.lenis) {
            window.lenis.scrollTo(0, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                lerp: 0.05, // Match LenisProvider configuration
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }
    }, []);

    useEffect(() => {
        const handleWheel = (e) => {
            if (window.lenis) {
                e.preventDefault();
                window.lenis.scrollTo(window.lenis.targetScroll + (e.deltaY * 1.2), {
                    wheelMultiplier: 1.2 // Match Lenis config
                });
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

    return (

        <motion.div
            style={{
                opacity: containerOpacity,
                scale: containerScale,
                transition: {
                    opacity: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                    // scale: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
                }
            }}
            className={cn(
                "fixed flex z-20 bg-primary-foreground cursor-pointer items-center justify-center rounded-full shadow-lg",
                {
                    "top-0 end-0": position === "top-right",
                    "bottom-5 end-5": position === "bottom-right",
                    "top-0 start-0": position === "top-left",
                    "bottom-0 start-0": position === "bottom-left",
                }
            )}
            onClick={scrollToTop}
            role="button"
            aria-label="Scroll to top"
            aria-live="polite"
            aria-atomic="true"
            aria-describedby="scroll-top-tooltip"
            tabIndex={0}
        >
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="49"
                                fill="none"
                                stroke="var(--color-border)"
                                strokeWidth={strokeSize}
                                strokeOpacity={0.2}
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="49"
                                pathLength="1"
                                stroke="var(--color-primary-default)"
                                fill="none"
                                strokeDashoffset="0"
                                strokeWidth={strokeSize}
                                strokeLinecap="round"
                                style={{
                                    pathLength: scrollYProgress,
                                    transition: {
                                        pathLength: {
                                            duration: 0.1,
                                            ease: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                                        }
                                    }
                                }}
                            />
                            <foreignObject x="0" y="0" width="100" height="100">
                                <div className="flex items-center justify-center w-full h-full">
                                    <ChevronUp className="text-primary-default h-9 w-9" />
                                </div>
                            </foreignObject>
                        </svg>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Elevator up!</p>
                        <TooltipArrow />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </motion.div>
    );
}