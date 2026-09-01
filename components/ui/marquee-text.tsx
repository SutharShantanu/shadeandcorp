"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MarqueeTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  className?: string;
  textClassName?: string;
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  mode?: "hover" | "always";
}

export function MarqueeText({
  text,
  className,
  textClassName,
  speed = 25,
  mode = "hover",
  ...props
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowWidth, setOverflowWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;
        const diff = textWidth - containerWidth;
        if (diff > 1) {
          setIsOverflowing(true);
          setOverflowWidth(diff);
        } else {
          setIsOverflowing(false);
          setOverflowWidth(0);
        }
      }
    };

    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    return () => ro.disconnect();
  }, [text]);

  const duration = Math.max(1.8, (overflowWidth + 12) / speed);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={text}
      className={cn(
        "relative overflow-hidden whitespace-nowrap select-none w-full min-w-0 flex items-center h-full group/marquee",
        className
      )}
      {...props}
    >
      <span
        ref={textRef}
        className={cn(
          "inline-block whitespace-nowrap will-change-transform leading-normal",
          isOverflowing ? "" : "truncate",
          textClassName
        )}
        style={
          isOverflowing && isHovered
            ? {
                transform: `translateX(-${overflowWidth + 6}px)`,
                transition: `transform ${duration}s linear`,
              }
            : isOverflowing
            ? {
                transform: "translateX(0px)",
                transition: "transform 0.4s ease-out",
              }
            : undefined
        }
      >
        {text}
      </span>
      {isOverflowing && (
        <span
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-popover to-transparent transition-opacity",
            isHovered ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  );
}

export default MarqueeText;
