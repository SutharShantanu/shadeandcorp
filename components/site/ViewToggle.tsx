"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Grid2X2, Grid3X3, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function ViewToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") || "grid";
  const columns = searchParams.get("columns") || "3";

  const setView = (newView: string, cols?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    if (cols) {
      params.set("columns", cols);
    } else {
      params.delete("columns");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const layouts = [
    { id: "list", icon: LayoutList, label: "List View", action: () => setView("list") },
    { id: "grid-2", icon: Grid2X2, label: "2 Columns", action: () => setView("grid", "2") },
    { id: "grid-3", icon: Grid3X3, label: "3 Columns", action: () => setView("grid", "3") },
    { id: "grid-4", icon: LayoutGrid, label: "4 Columns", action: () => setView("grid", "4") },
  ];

  const isActive = (layout: typeof layouts[0]) => {
    if (layout.id === "list") return view === "list";
    const cols = layout.id.split("-")[1];
    return view === "grid" && columns === cols;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center border rounded-xl p-1 gap-1">
        {layouts.map((layout) => (
          <Tooltip key={layout.id}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive(layout) ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "size-8 transition-all",
                  isActive(layout)
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={layout.action}
              >
                <layout.icon className="size-4 max-w-4 min-w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs font-medium">{layout.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
