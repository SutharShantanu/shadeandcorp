import * as React from "react"
import Link from "next/link"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils" // assumes you have a `cn` utility

// --- Link Variants ---
const linkVariants = cva({
    variants: {
        variant: {
            default: "block text-primary hover:underline underline-offset-4",
            linkHover1:
                "relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 after:bg-primary-default after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0",

            linkHover2:
                "relative after:absolute after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 after:bg-primary-default after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100",

            grow:
                "inline-block transform transition-transform duration-300 hover:scale-105 text-primary",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

// --- Reusable Link Component ---
const NextLink = React.forwardRef(
    ({ href, children, className, variant, ...props }, ref) => {
        return (
            <Link
                ref={ref}
                href={href}
                className={cn("transition-all text-sm font-medium inline-block w-fit min-w-fit h-fit min-h-fit max-h-fit", linkVariants({ variant }), className)}
                {...props}
            >
                {children}
            </Link>
        )
    }
)

NextLink.displayName = "NextLink"

export { NextLink, linkVariants }
