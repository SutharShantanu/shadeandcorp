"use client";

import React, { useId, useState, forwardRef } from "react";
import { EyeIcon, EyeOffIcon, CheckCircle2, Circle, Lock } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "./label";

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  showStrengthIndicator?: boolean;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const percent = (passed / 5) * 100;

  const label =
    passed <= 2
      ? "Weak"
      : passed === 3
        ? "Fair"
        : passed === 4
          ? "Good"
          : "Strong";
  const barColor =
    passed <= 2
      ? "bg-red-500"
      : passed === 3
        ? "bg-amber-500"
        : passed === 4
          ? "bg-blue-500"
          : "bg-green-600";

  const requirements = [
    { key: "length", label: "8+ chars", passed: checks.length },
    { key: "upper", label: "Uppercase", passed: checks.upper },
    { key: "lower", label: "Lowercase", passed: checks.lower },
    { key: "number", label: "Number", passed: checks.number },
    { key: "symbol", label: "Symbol", passed: checks.symbol },
  ];

  return (
    <motion.div
      className="space-y-2 mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">Strength: {label}</span>
        <motion.div
          layout
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Badge variant="secondary">
            {Math.round(percent)}%
          </Badge>
        </motion.div>
      </div>
      <motion.div
        layout
        initial={{ opacity: 0.7, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ duration: 0.3 }}
      >
        <Progress
          value={percent}
          className="h-2"
          indicatorClassName={cn("transition-all duration-300", barColor)}
        />
      </motion.div>
      <motion.div className="flex items-center gap-2 flex-wrap" layout>
        <AnimatePresence>
          {requirements.map((req) => (
            <motion.div
              key={req.key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Badge
                variant={req.passed ? "success-light" : "outline"}
                className={req.passed ? "justify-center" : "justify-center text-muted-foreground"}
              >
                {req.passed ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                {req.label}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, label, id, showStrengthIndicator, onChange, value, ...props },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [localValue, setLocalValue] = useState(value?.toString() || "");
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      onChange?.(e);
    };

    const currentPassword = value !== undefined ? value.toString() : localValue;

    return (
      <div className="w-full space-y-2">
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-medium text-muted-foreground"
          >
            {label}
          </Label>
        )}
        <InputGroup className={className}>
          <InputGroupAddon align="inline-start">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            id={inputId}
            ref={ref}
            className={cn(currentPassword ? "font-mono" : "font-sans")}
            placeholder="Your Password"
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={handleChange}
            {...props}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsVisible((prev) => !prev)}
              className="text-muted-foreground"
              tabIndex={-1}
            >
              {isVisible ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isVisible ? "Hide password" : "Show password"}
              </span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {showStrengthIndicator && (
          <PasswordStrength password={currentPassword} />
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
