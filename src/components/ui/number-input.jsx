"use client";

import NumberFlow from "@number-flow/react";
import clsx from "clsx/lite";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

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
        {icon === "minus" ? <Minus className="size-4" absoluteStrokeWidth strokeWidth={3.5} /> : <Plus className="size-4" absoluteStrokeWidth strokeWidth={3.5} />}
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
                    "spin-hide w-fit bg-transparent text-center text-subheading font-[inherit] text-transparent outline-none",
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
                className="pointer-events-none"
                willChange
            />
        </div>
    );
});

export { NumberInputRoot, NumberInputButton, NumberInputField };
