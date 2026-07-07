import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

export interface ExpandableButtonProps extends React.ComponentProps<
  typeof Button
> {
  text: string;
  icon?: React.ElementType;
}

export const ExpandableButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableButtonProps
>(({ text, icon: Icon = ChevronRight, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="secondary"
      className={cn(
        "group/fab relative flex h-9 w-9 items-center overflow-hidden rounded-full p-0 transition-[width] duration-300 ease-in-out hover:w-24",
        className,
      )}
      {...props}
    >
      <span className="ml-8 pr-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 text-xs font-medium">
        {text}
      </span>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/fab:left-4 group-hover/fab:-translate-x-0 h-4 w-4">
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
