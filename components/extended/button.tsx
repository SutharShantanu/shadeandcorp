import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface ExpandableButtonProps extends Omit<React.ComponentProps<typeof Button>, "size"> {
  text: string;
  icon?: React.ElementType;
  size?: "xs" | "sm" | "default" | "lg";
}

const sizeClasses = {
  xs: "h-7 w-7 hover:w-28",
  sm: "h-8 w-8 hover:w-28",
  default: "h-9 w-9 hover:w-28",
  lg: "h-10 w-10 hover:w-28",
};

export const ExpandableButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableButtonProps
>(({ text, icon: Icon = ChevronRight, className, size = "sm", ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      className={cn(
        "group/fab relative flex items-center overflow-hidden rounded-full transition-[width] duration-300 ease-in-out",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="ml-6 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 text-xs font-medium">
        {text}
      </span>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/fab:left-4 group-hover/fab:translate-x-0 h-4 w-4">
        <Icon className="absolute inset-0 h-4 w-4" aria-hidden="true" />
      </div>
    </Button>
  );
});
ExpandableButton.displayName = "ExpandableButton";

export const NavigateHomeButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ExpandableButtonProps, "icon" | "text"> & { text?: string }
>(({ className, text = "Back to Home", ...props }, ref) => {
  return (
    <ExpandableButton
      ref={ref}
      text={text}
      icon={ChevronLeft}
      className={cn("hover:w-fit absolute top-4 left-4 z-50", className)}
      {...props}
    />
  );
});
NavigateHomeButton.displayName = "NavigateHomeButton";
