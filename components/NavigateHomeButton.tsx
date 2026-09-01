"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigateHomeButtonProps {
  className?: string;
}

const NavigateHomeButton = ({ className }: NavigateHomeButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className={cn("absolute top-4 left-4 z-50", className)}
      onClick={() => router.push("/")}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back to Home
    </Button>
  );
};

export default NavigateHomeButton;
