"use client";

import NumberFlow from "@number-flow/react";
import clsx from "clsx/lite";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

const NumberInputRoot = ({ className, children }) => (
    <div
        className={clsx(
            "group flex items-center border border-border rounded-xs text-subheading font-semibold transition-[box-shadow] dark:ring-zinc-800",
            className
        )}
    >
        {children}
    </div>
);

const NumberInputButton = React.forwardRef(({ className, onClick, disabled, icon: Icon }, ref) => (
    <Button
        ref={ref}
        aria-hidden="true"
        tabIndex={-1}
        className={clsx("flex items-center px-2 h-8 w-8 text-primary-default border border-border", className)}
        disabled={disabled}
        onPointerDown={onClick}
    >
        <Icon className="size-4" absoluteStrokeWidth strokeWidth={3.5} />
    </Button>
));

const NumberInputField = React.forwardRef(({ className, value, onInput, min, max }, ref) => {
    const defaultValue = React.useRef(value);
    const [animated, setAnimated] = React.useState(true);
    const [showCaret, setShowCaret] = React.useState(true);

    const handleInput = (event) => {
        setAnimated(false);
        let next = value;
        const el = event.currentTarget;
        if (el.value === "") {
            next = defaultValue.current;
        } else {
            const num = parseInt(el.value);
            if (!isNaN(num) && min <= num && num <= max) next = num;
        }
        el.value = String(next);
        onInput?.(next);
    };

    return (
        <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
            <input
                ref={ref}
                className={clsx(
                    showCaret ? "caret-primary" : "caret-transparent",
                    "spin-hide w-fit bg-transparent py-2 text-center text-subheading font-[inherit] text-transparent outline-none",
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

const NumberInput = ({ value = 0, min = -Infinity, max = Infinity, onChange, className }) => {
    const inputRef = React.useRef(null);

    const handlePointerDown = (diff) => (event) => {
        if (event.pointerType === "mouse") {
            event.preventDefault();
            inputRef.current?.focus();
        }
        const newVal = Math.min(Math.max(value + diff, min), max);
        onChange?.(newVal);
    };

    return (
        <NumberInputRoot className={className}>
            <NumberInputButton onClick={handlePointerDown(-1)} disabled={value <= min} icon={Minus} />
            <NumberInputField ref={inputRef} value={value} onInput={onChange} min={min} max={max} />
            <NumberInputButton onClick={handlePointerDown(1)} disabled={value >= max} icon={Plus} />
        </NumberInputRoot>
    );
};

export { NumberInput, NumberInputRoot, NumberInputButton, NumberInputField };
