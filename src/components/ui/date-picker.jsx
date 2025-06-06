"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { Calendar as CalendarIcon, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "./badge";
import AnimatedNumber from "./number-input";
import { AnimatedButton } from "./animated-buttons";
import { AnimatePresence, motion } from "framer-motion";

export function DatePicker ({
    date,
    setDate,
    className,
    btnClassName,
    popoverClassName,
    selectClassName,
    calendarClassName,
}) {
    const popoverRef = useRef(null);

    const currentYear = useMemo(() => new Date().getFullYear(), []);

    const [month, setMonth] = useState(date ? date.getMonth() : new Date().getMonth());
    const [year, setYear] = useState(date ? date.getFullYear() : currentYear);

    const [open, setOpen] = useState(false);

    const years = useMemo(
        () => Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i),
        [currentYear]
    );

    const months = useMemo(() => {
        return eachMonthOfInterval({
            start: startOfYear(new Date(year, 0, 1)),
            end: endOfYear(new Date(year, 0, 1)),
        });
    }, [year]);

    useEffect(() => {
        if (date) {
            setMonth(date.getMonth());
            setYear(date.getFullYear());
        }
    }, [date]);

    const handleYearChange = useCallback(
        (selectedYear) => {
            const newYear = parseInt(selectedYear, 10);
            setYear(newYear);

            setDate((prevDate) => {
                if (prevDate) {
                    const updatedDate = new Date(prevDate);
                    updatedDate.setFullYear(newYear);
                    return updatedDate;
                }
                return new Date(newYear, month, 1);
            });
        },
        [month, setDate]
    );

    const handleMonthChange = useCallback(
        (selectedMonth) => {
            const newMonth = parseInt(selectedMonth, 10);
            setMonth(newMonth);

            setDate((prevDate) => {
                if (prevDate) {
                    const updatedDate = new Date(prevDate);
                    updatedDate.setMonth(newMonth);
                    return updatedDate;
                }
                return new Date(year, newMonth, 1);
            });
        },
        [year, setDate]
    );

    const handleClear = useCallback(() => {
        setDate(null);
        popoverRef.current?.close?.();
        toast.info("Date selection cleared.");
    }, [setDate]);

    const { selectedDate, prefix, dateNumber, ordinal, postfix } = useMemo(() => {
        if (!date) return { selectedDate: "", prefix: "", dateNumber: "", ordinal: "", postfix: "" };

        const formatted = format(date, "PPP");
        const match = formatted.match(/^(.*?)(\d{1,2})(st|nd|rd|th)(.*)$/);

        if (match) {
            return {
                selectedDate: formatted,
                prefix: match[1].trim(),
                dateNumber: match[2],
                ordinal: match[3],
                postfix: match[4].trim(),
            };
        }

        return { selectedDate: formatted, prefix: "", dateNumber: "", ordinal: "", postfix: "" };
    }, [date]);

    return (
        <Popover
            ref={popoverRef}
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "w-auto border flex border-border bg-primary-foreground text-primary-default",
                        btnClassName
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary-default" />
                    {date ? (
                        <span className="text-primary-default">{prefix}
                            <AnimatedNumber
                                value={dateNumber}
                                canAnimate={true}
                                className="text-sm pr-0"
                            />
                            {ordinal}
                            {postfix}</span>
                    ) : (
                        <span className="text-primary-default">Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>

            <AnimatePresence>
                {open && (
                    <PopoverContent
                        asChild
                        className={cn(popoverClassName, className)}
                        align="start"
                    >
                        <motion.div
                            key="popover-content"
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={cn("w-fit p-4 flex flex-col gap-2 bg-background border rounded-md shadow-lg")}
                        >
                            <div className="flex justify-between gap-1 w-full">
                                <Select
                                    onValueChange={handleYearChange}
                                    value={year.toString()}
                                    className={cn("w-1/2 max-w-fit", selectClassName)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem key={y} value={y.toString()}>
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    onValueChange={handleMonthChange}
                                    value={month.toString()}
                                    className={cn("w-1/2 max-w-fit", selectClassName)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((m, index) => (
                                            <SelectItem key={index} value={index.toString()}>
                                                {format(m, "MMMM")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Calendar
                                mode="single"
                                selected={date || undefined}
                                onSelect={setDate}
                                month={new Date(year, month)}
                                onMonthChange={(newMonth) => {
                                    setMonth(newMonth.getMonth());
                                    setYear(newMonth.getFullYear());
                                }}
                                initialFocus
                                className={calendarClassName}
                            />
                            <div
                                className={cn(
                                    "flex items-center w-full justify-between p-2 overflow-hidden transition-all duration-300 ease-in-out",
                                    date ? "max-h-40 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
                                )}
                            >
                                <Badge className="bg-primary-default rounded-full">
                                    {prefix}
                                    <AnimatedNumber
                                        value={dateNumber}
                                        canAnimate={true}
                                        className="text-sm pr-0"
                                    />
                                    {ordinal}
                                    {postfix}
                                </Badge>
                                <AnimatedButton
                                    onClick={handleClear}
                                    variant="expandIcon"
                                    iconPlacement="right"
                                    Icon={CircleX}
                                    className="text-primary-default border border-border h-fit px-2 py-1 overflow-hidden"
                                >
                                    Clear
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </PopoverContent>
                )}
            </AnimatePresence>
        </Popover>
    );
}
