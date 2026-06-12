"use client";

import * as React from "react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme = "light", setTheme } = useTheme();
  // const [mounted, setMounted] = React.useState(false)

  // React.useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) {
  //   return (
  //     <Button variant="outline" size="icon-sm">
  //       <span className="sr-only">Toggle theme</span>
  //     </Button>
  //   );
  // }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      aria-label={`Current theme is ${theme}. Click to toggle.`}
      className="relative"
    >
      <SunIcon
        className={cn(
          "size-4 transition-all duration-300 absolute",
          theme === "light"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0",
        )}
      />
      <MoonIcon
        className={cn(
          "size-4 transition-all duration-300 absolute",
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0",
        )}
      />
      <MonitorIcon
        className={cn(
          "size-4 transition-all duration-300 absolute",
          theme === "system"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0",
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
