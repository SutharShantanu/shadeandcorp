"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MenuToggleIcon = React.forwardRef(
  ({ open, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn("pointer-events-none", className)}
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <path
          d="M4 12L20 12"
          className={cn(
            "origin-center -translate-y-[7px] transition-all duration-300",
            "[transition-timing-function:cubic-bezier(.5,.85,.25,1.1)]",
            open && "translate-x-0 translate-y-0 rotate-[315deg]"
          )}
        />
        <path
          d="M4 12H20"
          className={cn(
            "origin-center transition-all duration-300",
            "[transition-timing-function:cubic-bezier(.5,.85,.25,1.8)]",
            open && "rotate-45"
          )}
        />
        <path
          d="M4 12H20"
          className={cn(
            "origin-center translate-y-[7px] transition-all duration-300",
            "[transition-timing-function:cubic-bezier(.5,.85,.25,1.1)]",
            open && "translate-y-0 rotate-[135deg]"
          )}
        />
      </svg>
    );
  }
);
MenuToggleIcon.displayName = "MenuToggleIcon";

const MenuToggleButton = React.forwardRef(
  (
    { className, open, onClick, variant = "outline", size = "icon", ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={onClick}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className={cn("group", className)}
        {...props}
      >
        <MenuToggleIcon open={open} />
      </Button>
    );
  }
);
MenuToggleButton.displayName = "MenuToggleButton";

export { MenuToggleButton, MenuToggleIcon };
