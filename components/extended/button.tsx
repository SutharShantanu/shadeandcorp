import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Plus } from "lucide-react";

export interface ExpandableButtonProps extends Omit<React.ComponentProps<typeof Button>, "size"> {
  text: string;
  icon?: React.ElementType | React.ReactNode;
  size?: "xs" | "sm" | "default" | "lg";
}

const expandableSizeClasses = {
  xs: "h-7 w-7 hover:w-28",
  sm: "h-8 w-8 hover:w-32",
  default: "h-9 w-9 hover:w-36",
  lg: "h-10 w-10 hover:w-40",
};

const iconSizeClasses = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
};

const textSizeClasses = {
  xs: "text-tiny",
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
};

function renderIconElement(
  icon: React.ElementType | React.ReactNode | undefined,
  defaultIcon: React.ElementType,
  className: string
) {
  if (React.isValidElement(icon)) {
    return React.cloneElement(
      icon as React.ReactElement<{ className?: string; "aria-hidden"?: string }>,
      {
        className: cn(
          className,
          (icon.props as { className?: string }).className
        ),
        "aria-hidden": "true",
      }
    );
  }
  const IconComponent = (icon as React.ElementType) || defaultIcon;
  return <IconComponent className={className} aria-hidden="true" />;
}

export const ExpandableButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableButtonProps
>(({ text, icon, variant = "secondary", size = "sm", className, ...props }, ref) => {
  const iconClassName = cn(
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover/fab:left-3 group-hover/fab:translate-x-0",
    iconSizeClasses[size]
  );

  return (
    <Button
      ref={ref}
      variant={variant}
      size="icon"
      className={cn(
        "group/fab relative flex items-center overflow-hidden rounded-full transition-[width] duration-300 ease-in-out",
        expandableSizeClasses[size],
        className
      )}
      {...props}
    >
      {renderIconElement(icon, Plus, iconClassName)}
      <span className={cn("ml-9 pr-4 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 font-medium", textSizeClasses[size])}>
        {text}
      </span>
    </Button>
  );
});
ExpandableButton.displayName = "ExpandableButton";

export const SlidingButton = React.forwardRef<
  HTMLButtonElement,
  ExpandableButtonProps
>(({ text, icon, variant = "secondary", size = "sm", className, ...props }, ref) => {
  const iconClassName = cn(
    "absolute right-2.5 translate-x-8 opacity-0 transition-all duration-300 group-hover/sliding:translate-x-0 group-hover/sliding:opacity-100",
    iconSizeClasses[size]
  );

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size === "xs" ? "sm" : size}
      className={cn(
        "group/sliding relative overflow-hidden rounded-full",
        size === "xs" ? "px-3" : size === "sm" ? "px-4" : size === "lg" ? "px-8" : "px-6",
        className
      )}
      {...props}
    >
      <span className={cn("inline-flex items-center transition-transform duration-300 group-hover/sliding:-translate-x-2 group-hover/sliding:mr-1 font-medium", textSizeClasses[size])}>
        {text}
      </span>
      {renderIconElement(icon, ChevronRight, iconClassName)}
    </Button>
  );
});
SlidingButton.displayName = "SlidingButton";
SlidingButton.displayName = "SlidingButton";

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
