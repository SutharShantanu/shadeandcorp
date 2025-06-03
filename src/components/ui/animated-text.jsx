import { cn } from "@/lib/utils";

const AnimatedGradientText = ({ text, className }) => (
    <span
        className={cn(
            "inline-flex animate-text-gradient bg-linear-to-r from-accent-default via-rating-default to-destructive-default bg-[200%_auto] text-transparent bg-clip-text text-nowrap w-fit",
            className,
        )}
    >
        {text}
    </span>
);

export default AnimatedGradientText;
