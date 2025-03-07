"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "./button";
import { motion, MotionConfig } from "framer-motion";
import NumberFlow, { useCanAnimate } from "@number-flow/react";
import clsx from "clsx";

const NumberInputRoot = ({ className, children }) => (
    <div
        className={clsx(
            "group flex items-center border border-border rounded-xs text-subheading font-semibold transition-[box-shadow] w-fit divide-x h-9 divide-border",
            className
        )}
    >
        {children}
    </div>
);

const NumberInputButton = React.forwardRef(({ className, onClick, disabled, icon }, ref) => (
    <Button
        ref={ref}
        aria-hidden="true"
        tabIndex={-1}
        className={clsx("flex items-center px-2 rounded-l-xs rounded-none w-8 h-9 text-primary-default", className)}
        disabled={disabled}
        onPointerDown={onClick}
    >
        {icon === "minus" ? <Minus className="size-4" absoluteStrokeWidth strokeWidth={2} /> : <Plus className="size-4" absoluteStrokeWidth strokeWidth={2} />}
    </Button>
));

const NumberInputField = React.forwardRef(({ className, value, onInput, min, max }, ref) => {
    const [animated, setAnimated] = React.useState(true);
    const [showCaret, setShowCaret] = React.useState(true);

    const handleInput = (event) => {
        setAnimated(false);
        const el = event.currentTarget;
        let next = el.value === "" ? min : parseInt(el.value);

        if (!isNaN(next) && min <= next && next <= max) {
            onInput?.(next);
        } else {
            el.value = String(value);
        }
    };

    return (
        <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
            <input
                ref={ref}
                className={clsx(
                    showCaret ? "caret-primary" : "caret-transparent",
                    "spin-hide w-fit bg-transparent text-center text-description font-[inherit] text-transparent outline-none",
                    className
                )}
                style={{ fontKerning: "none" }}
                type="number"
                min={min}
                step={1}
                autoComplete="off"
                inputMode="numeric"
                max={max}
                value={value}
                onInput={handleInput}
            />
            <NumberFlow
                value={value}
                locales="en-US"
                format={{ useGrouping: false }}
                aria-hidden="true"
                animated={animated}
                onAnimationsStart={() => setShowCaret(false)}
                onAnimationsFinish={() => setShowCaret(true)}
                className="pointer-events-none text-description font-description"
                willChange
            />
        </div>
    );
});

export { NumberInputRoot, NumberInputButton, NumberInputField };

const MotionNumberFlow = motion(NumberFlow);

export default function AnimatedNumber ({ value, isPercentage = false }) {
    const canAnimate = useCanAnimate();

    return (
        <MotionConfig
            transition={{
                layout: canAnimate
                    ? { duration: 0.9, bounce: 0, type: "spring" }
                    : { duration: 0 },
            }}
        >
            <motion.span
                className={clsx(
                    "inline-flex items-center px-1 text-description font-description transition-all ease-in-out"
                )}
                layout
            >
                <MotionNumberFlow
                    value={isPercentage ? value / 100 : value}
                    format={
                        isPercentage
                            ? { style: "percent", maximumFractionDigits: 2 }
                            : { maximumFractionDigits: 2 }
                    }
                    style={{
                        "--number-flow-char-height": "0.85em",
                        "--number-flow-mask-height": "0.3em",
                    }}
                    layout
                    layoutRoot
                />
            </motion.span>
        </MotionConfig>
    );
}
