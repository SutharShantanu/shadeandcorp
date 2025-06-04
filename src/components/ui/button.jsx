import React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-default text-primary-foreground hover:bg-primary-default/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        expandIcon: "group relative bg-primary-default text-primary-foreground hover:bg-primary-default/90",
        ringHover: "bg-primary-default text-primary-foreground transition-all duration-300 hover:bg-primary-default/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        shine: "animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] text-primary-foreground",
        gooeyRight: "relative z-0 overflow-hidden bg-primary-default text-primary-foreground transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r before:transition-transform before:duration-1000 hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
        gooeyLeft: "relative z-0 overflow-hidden bg-primary-default text-primary-foreground transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l after:transition-transform after:duration-1000 hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      Icon,
      iconPlacement,
      isLoading = false,
      loadingPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isLeft = loadingPosition === "left"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className, "group")}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && isLeft && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        )}

        {Icon && iconPlacement === "left" && !isLoading && (
          <div className="group-hover:translate-x-100 w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:pr-2 group-hover:opacity-100">
            <Icon />
          </div>
        )}

        <Slottable>
          <span className={isLoading ? "opacity-70" : ""}>{children}</span>
        </Slottable>

        {Icon && iconPlacement === "right" && !isLoading && (
          <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
            <Icon />
          </div>
        )}

        {isLoading && !isLeft && (
          <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-l-transparent" />
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
