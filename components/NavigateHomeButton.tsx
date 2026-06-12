import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigateHomeButtonProps {
  className?: string;
}

const NavigateHomeButton = ({ className }: NavigateHomeButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      className={cn(
        "group/fab absolute top-4 left-4 z-50 flex h-10 w-10 items-center overflow-hidden rounded-full p-0 transition-[width] duration-300 ease-in-out hover:w-36",
        className
      )}
      onClick={() => router.push("/")}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover/fab:left-4 group-hover/fab:-translate-x-0 h-4 w-4">
        <Home
          aria-hidden="true"
          className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover/fab:opacity-0 group-hover/fab:-rotate-90 group-hover/fab:scale-50"
        />
        <ChevronLeft
          aria-hidden="true"
          className="absolute inset-0 h-4 w-4 opacity-0 rotate-90 scale-50 transition-all duration-300 group-hover/fab:opacity-100 group-hover/fab:rotate-0 group-hover/fab:scale-100"
        />
      </div>

      <span className="ml-8 pr-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100 text-xs font-medium">
        Back to Home
      </span>
    </Button>
  );
};

export default NavigateHomeButton;
