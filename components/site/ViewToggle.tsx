"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ViewToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "grid";

  const setView = (newView: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center border rounded-md bg-white dark:bg-zinc-950 p-1 gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
            "h-8 w-8 rounded-sm", 
            view === "grid" ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setView("grid")}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
            "h-8 w-8 rounded-sm", 
            view === "list" ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => setView("list")}
        aria-label="List View"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
