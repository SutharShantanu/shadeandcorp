import { cn } from "@/lib/utils"

function Skeleton ({
  className,
  ...props
}) {
  return (<div className={cn("animate-pulse rounded-xs bg-muted", className)} {...props} />);
}

export { Skeleton }
