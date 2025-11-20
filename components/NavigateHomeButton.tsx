import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavigateHomeButtonProps {
  className?: string;
}

const NavigateHomeButton = ({ className }: NavigateHomeButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("gap-2 w-fit absolute top-4 left-4 ", className)}
      onClick={() => router.push("/")}
    >
      <Home className="h-4 w-4" />
      Back to Home
    </Button>
  );
};

export default NavigateHomeButton;
