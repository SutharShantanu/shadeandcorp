"use client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    const badgeVariant = passed <= 2 ? "destructive" : passed === 3 ? "secondary" : "default";

    return (
        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Strength: {label}</span>
                <motion.div layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                    <Badge variant={badgeVariant} className="text-xs">
                        {Math.round(percent)}%
                    </Badge>
                </motion.div>
            </div>
            <motion.div layout initial={{ opacity: 0.7, width: 0 }} animate={{ opacity: 1, width: "100%" }} transition={{ duration: 0.3 }}>
                <Progress
                    value={percent}
                    className="h-2"
                    indicatorClassName={cn("transition-all duration-300", barColor)}
                />
            </motion.div>
            <motion.div className="flex items-center gap-2 flex-wrap" layout>
                <AnimatePresence>
                    <motion.div key="length" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                        <Badge
                            variant={checks.length ? "secondary" : "outline"}
                            color={checks.length ? "success" : undefined}
                            className="shadow-none rounded-full justify-center"
                        >
                            {checks.length ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                            8+ chars
                        </Badge>
                    </motion.div>
                    <motion.div key="upper" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                        <Badge
                            variant={checks.upper ? "secondary" : "outline"}
                            color={checks.upper ? "success" : undefined}
                            className="shadow-none rounded-full justify-center"
                        >
                            {checks.upper ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                            Uppercase
                        </Badge>
                    </motion.div>
                    <motion.div key="lower" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                        <Badge
                            variant={checks.lower ? "secondary" : "outline"}
                            color={checks.lower ? "success" : undefined}
                            className="shadow-none rounded-full justify-center"
                        >
                            {checks.lower ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                            Lowercase
                        </Badge>
                    </motion.div>
                    <motion.div key="number" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                        <Badge
                            variant={checks.number ? "secondary" : "outline"}
                            color={checks.number ? "success" : undefined}
                            className="shadow-none rounded-full justify-center"
                        >
                            {checks.number ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                            Number
                        </Badge>
                    </motion.div>
                    <motion.div key="symbol" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                        <Badge
                            variant={checks.symbol ? "secondary" : "outline"}
                            color={checks.symbol ? "success" : undefined}
                            className="shadow-none rounded-full justify-center"
                        >
                            {checks.symbol ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Circle className="h-3 w-3 mr-1" />}
                            Symbol
                        </Badge>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}
