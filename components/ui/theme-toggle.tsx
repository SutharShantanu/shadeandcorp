"use client"

import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className={cn("w-24 h-8 rounded-full bg-muted border border-border", className)} />
        )
    }

    const isDark = theme === "dark"
    const isSystem = theme === "system"
    const isLight = theme === "light"

    // Position Logic
    const position = isDark ? "translate-x-0" : isSystem ? "translate-x-8" : "translate-x-16"

    // Container Background Logic
    // Using consistent bg-muted for track (Tabs style) to ensure visibility against bg-card/bg-background
    const containerBg = "bg-muted border-border"

    return (
        <div
            className={cn(
                "relative flex w-24 h-9 p-1 rounded-full transition-colors duration-300 border",
                containerBg,
                className
            )}
            role="group"
            aria-label="Theme toggle"
        >
            {/* Background Icons (Visual only) */}
            <div className="absolute inset-0 flex justify-between items-center px-1.5 pointer-events-none z-0">
                <Moon className={cn("w-4 h-4 transition-colors duration-300", isDark ? "text-transparent" : "text-muted-foreground")} strokeWidth={1.5} />
                <Monitor className={cn("w-4 h-4 transition-colors duration-300", isSystem ? "text-transparent" : "text-muted-foreground")} strokeWidth={1.5} />
                <Sun className={cn("w-4 h-4 transition-colors duration-300", isLight ? "text-transparent" : "text-muted-foreground")} strokeWidth={1.5} />
            </div>

            {/* Sliding Ball (Visual only) */}
            <div
                className={cn(
                    "absolute top-1 left-1 flex justify-center items-center w-6 h-6 rounded-full shadow-sm transition-all duration-300 z-10 pointer-events-none",
                    position,
                    "bg-background border border-border"
                )}
            >
                {isDark && <Moon className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />}
                {isSystem && <Monitor className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />}
                {isLight && <Sun className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />}
            </div>

            {/* Interactive Click Zones */}
            <div className="absolute inset-0 grid grid-cols-3 z-20">
                <button
                    onClick={() => setTheme("dark")}
                    className="h-full w-full cursor-pointer focus:outline-none"
                    aria-label="Select dark mode"
                />
                <button
                    onClick={() => setTheme("system")}
                    className="h-full w-full cursor-pointer focus:outline-none"
                    aria-label="Select system mode"
                />
                <button
                    onClick={() => setTheme("light")}
                    className="h-full w-full cursor-pointer focus:outline-none"
                    aria-label="Select light mode"
                />
            </div>
        </div>
    )
}
