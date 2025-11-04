import * as React from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { Input } from "./input";
import { Separator } from "./separator";

interface NumberFieldProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "size"> {
  onValueChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
}

function NumberField({
  className,
  onValueChange,
  step = 1,
  min,
  max,
  value,
  defaultValue,
  disabled,
  size = "md",
  ...props
}: NumberFieldProps) {
  const [internalValue, setInternalValue] = React.useState<number>(
    value !== undefined
      ? Number(value)
      : defaultValue !== undefined
      ? Number(defaultValue)
      : 0
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  const updateValue = (newValue: number) => {
    let finalValue = newValue;

    if (min !== undefined) {
      finalValue = Math.max(finalValue, min);
    }
    if (max !== undefined) {
      finalValue = Math.min(finalValue, max);
    }

    setInternalValue(finalValue);
    onValueChange?.(finalValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.valueAsNumber;
    if (!isNaN(newValue)) {
      updateValue(newValue);
    }
  };

  const increment = () => {
    updateValue(internalValue + step);
  };

  const decrement = () => {
    updateValue(internalValue - step);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrement();
    }
  };

  // Sync with external value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(Number(value));
    }
  }, [value]);

  const isMinDisabled = min !== undefined && internalValue <= min;
  const isMaxDisabled = max !== undefined && internalValue >= max;

  // Size variants
  const sizeStyles = {
    xs: {
      container: "h-7 text-xs",
      button: "w-6",
      icon: "h-3 w-3",
      input: "text-xs",
    },
    sm: {
      container: "h-8 text-sm",
      button: "w-7",
      icon: "h-3.5 w-3.5",
      input: "text-sm",
    },
    md: {
      container: "h-9 text-base",
      button: "w-8",
      icon: "h-4 w-4",
      input: "text-base",
    },
    lg: {
      container: "h-10 text-lg",
      button: "w-9",
      icon: "h-4.5 w-4.5",
      input: "text-lg",
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex items-center rounded-md border border-input bg-transparent shadow-xs overflow-hidden transition-colors",
        // "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        disabled && "opacity-50 cursor-not-allowed",
        currentSize.container,
        className
      )}
    >
      {/* Decrement Button - Left Side */}
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || isMinDisabled}
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground hover:bg-muted transition-colors",
          "disabled:pointer-events-none disabled:opacity-50 px-2",
          currentSize.button
        )}
        tabIndex={-1}
      >
        <Minus className={cn("min-w-4", currentSize.icon)} />
      </button>
      <Separator orientation="vertical" className="h-4" />
      {/* Input Field */}
      <Input
        ref={inputRef}
        type="number"
        value={internalValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        className={cn(
          "border-0 shadow-none bg-gray-50 min-w-fit px-0 focus-visible:ring-0 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          currentSize.input
        )}
        {...props}
      />
      <Separator orientation="vertical" className="h-4" />

      {/* Increment Button - Right Side */}
      <button
        type="button"
        onClick={increment}
        disabled={disabled || isMaxDisabled}
        className={cn(
          "flex items-center justify-center h-full text-muted-foreground hover:bg-muted transition-colors",
          "disabled:pointer-events-none disabled:opacity-50 px-2",
          currentSize.button
        )}
        tabIndex={-1}
      >
        <Plus className={cn("min-w-4", currentSize.icon)} />
      </button>
    </div>
  );
}

export { Input, NumberField };
