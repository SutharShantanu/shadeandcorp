"use client";

import { useRouter } from "next/navigation";
import { ExpandableButton } from "@/components/extended/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigateHomeButtonProps {
  className?: string;
}

const NavigateHomeButton = ({ className }: NavigateHomeButtonProps) => {
  const router = useRouter();
  return (
    <ExpandableButton
      text="Back to Home"
      icon={ChevronLeft}
      className={cn("absolute top-4 left-4 z-50 hover:w-fit", className)}
      onClick={() => router.push("/")}
    />
  );
};

export default NavigateHomeButton;
