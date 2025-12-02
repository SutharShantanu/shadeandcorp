"use client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
    password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const percent = (passed / 5) * 100;

    const label = passed <= 2 ? "Weak" : passed === 3 ? "Fair" : passed === 4 ? "Good" : "Strong";
    const barColor = passed <= 2 ? "bg-red-500" : passed === 3 ? "bg-yellow-500" : passed === 4 ? "bg-blue-500" : "bg-green-600";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Strength: {label}</span>
                <Badge variant="secondary" className="text-xs font-semibold">
                    {Math.round(percent)}%
                </Badge>
            </div>
            <Progress
                value={percent}
                className="h-2"
                indicatorClassName={cn("transition-all duration-300", barColor)}
            />
            <div className="flex items-center gap-2 flex-wrap">
                <Badge className={cn("shadow-none rounded-full justify-center", checks.length ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600" : "bg-muted hover:bg-muted text-muted-foreground")}>
                    {checks.length ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    8+ chars
                </Badge>
                <Badge className={cn("shadow-none rounded-full justify-center", checks.upper ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600" : "bg-muted hover:bg-muted text-muted-foreground")}>
                    {checks.upper ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Uppercase
                </Badge>
                <Badge className={cn("shadow-none rounded-full justify-center", checks.lower ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600" : "bg-muted hover:bg-muted text-muted-foreground")}>
                    {checks.lower ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Lowercase
                </Badge>
                <Badge className={cn("shadow-none rounded-full justify-center", checks.number ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600" : "bg-muted hover:bg-muted text-muted-foreground")}>
                    {checks.number ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Number
                </Badge>
                <Badge className={cn("shadow-none rounded-full justify-center", checks.symbol ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600" : "bg-muted hover:bg-muted text-muted-foreground")}>
                    {checks.symbol ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                    Symbol
                </Badge>
            </div>
        </div>
    );
}
