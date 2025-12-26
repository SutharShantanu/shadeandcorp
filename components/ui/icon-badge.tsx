import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconBadgeVariants = cva(
    "inline-flex items-center justify-center rounded-full p-2 shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-muted text-muted-foreground",
                success:
                    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-500",
                info:
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-500",
                warning:
                    "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500",
                danger:
                    "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-500",
            },
            size: {
                sm: "p-1.5 [&>svg]:size-3",
                md: "p-2 [&>svg]:size-4",
                lg: "p-3 [&>svg]:size-5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
)

function IconBadge({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"div"> &
    VariantProps<typeof iconBadgeVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "div"

    return (
        <Comp
            data-slot="icon-badge"
            className={cn(iconBadgeVariants({ variant, size }), className)}
            {...props}
        />
    )
}

export { IconBadge, iconBadgeVariants }
