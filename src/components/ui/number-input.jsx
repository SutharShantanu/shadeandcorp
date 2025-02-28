"use client";

import * as React from "react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";

const NumberInput = React.forwardRef(({ value = 0, min = -Infinity, max = Infinity, onChange, className, ...props }, ref) => {
    const defaultValue = React.useRef(value);
    const inputRef = React.useRef(null);
    const [animated, setAnimated] = React.useState(true);
    const [showCaret, setShowCaret] = React.useState(true);

    const handlePointerDown = (diff) => (event) => {
        setAnimated(true);
        if (event.pointerType === "mouse") {
            event.preventDefault();
            inputRef.current?.focus();
        }
        const newVal = Math.min(Math.max(value + diff, min), max);
        onChange?.(newVal);
    };

    return (
        <div className={cn("group flex w-full bg-primary-default rounded-b-xs items-stretch transition-[box-shadow]", className)} {...props}>
            <Button
                aria-hidden="true"
                tabIndex={-1}
                className="flex-shrink-0 flex items-center bg-primary-default cursor-pointer text-primary-foreground rounded-none rounded-bl-xs"
                disabled={min != null && value <= min}
                onPointerDown={handlePointerDown(-1)}
            >
                <Minus className="size-4" />
            </Button>

            <div className="relative grid w-full items-center bg-muted-foreground justify-items-center text-center [grid-template-areas:'overlap']">
                <NumberFlow
                    value={value}
                    locales="en-US"
                    format={{ useGrouping: false }}
                    aria-hidden="true"
                    animated={animated}
                    onAnimationsStart={() => setShowCaret(false)}
                    onAnimationsFinish={() => setShowCaret(true)}
                    className="pointer-events-none text-primary-foreground font-heading text-description"
                    willChange
                />
            </div>

            <Button
                aria-hidden="true"
                tabIndex={-1}
                className="flex-shrink-0 flex items-center cursor-pointer bg-primary-default text-primary-foreground rounded-none rounded-br-xs"
                disabled={max != null && value >= max}
                onPointerDown={handlePointerDown(1)}
            >
                <Plus className="size-4" />
            </Button>
        </div>
    );
});

NumberInput.displayName = "NumberInput";

export { NumberInput };
