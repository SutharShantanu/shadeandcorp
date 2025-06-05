"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { format, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner" // ✅ Make sure 'sonner' toast is installed and set up
import { Badge } from "./badge"
import AnimatedNumber from "./number-input"

export function DatePicker ({ date, setDate }) {
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const popoverRef = useRef(null)

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear()
        return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)
    }, [])

    const months = useMemo(() => {
        if (year) {
            return eachMonthOfInterval({
                start: startOfYear(new Date(year, 0, 1)),
                end: endOfYear(new Date(year, 0, 1))
            })
        }
        return []
    }, [year])

    useEffect(() => {
        if (date) {
            setMonth(date.getMonth())
            setYear(date.getFullYear())
        }
    }, [date])

    const handleYearChange = (selectedYear) => {
        const newYear = parseInt(selectedYear, 10)
        setYear(newYear)
        if (date) {
            const newDate = new Date(date)
            newDate.setFullYear(newYear)
            setDate(newDate)
        }
    }

    const handleMonthChange = (selectedMonth) => {
        const newMonth = parseInt(selectedMonth, 10)
        setMonth(newMonth)
        if (date) {
            const newDate = new Date(date)
            newDate.setMonth(newMonth)
            setDate(newDate)
        } else {
            setDate(new Date(year, newMonth, 1))
        }
    }

    const handleClear = () => {
        setDate(null)
        popoverRef.current?.close?.() // ✅ Close the popover
        toast.info("Date selection cleared.") // ✅ Show toast
    }

    const selectedDate = format(date, "PPP");

    return (
        <Popover ref={popoverRef}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "w-fit border border-border bg-primary-foreground text-primary-default",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary-default" />
                    {date ? (
                        <span className="text-primary-default">Selected a date</span>
                    ) : (
                        <span className="text-primary-default">Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
                <div className="flex justify-between p-4 gap-x-1 w-full">
                    <Select onValueChange={handleYearChange} value={year.toString()} className="w-1/2 max-w-fit">
                        <SelectTrigger className="w-[120px]">
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
                    <Select onValueChange={handleMonthChange} value={month.toString()} className="w-1/2 max-w-fit">
                        <SelectTrigger className="w-[120px]">
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
                        setMonth(newMonth.getMonth())
                        setYear(newMonth.getFullYear())
                    }}
                    initialFocus
                />
                {date && (
                    <div className="flex items-center w-full justify-between p-2">
                        <Badge className="bg-primary-default rounded-xs">
                            <AnimatedNumber value={selectedDate} canAnimate={true} />
                        </Badge>
                        <Button
                            variant="ghost"
                            onClick={handleClear}
                            className="text-sm text-destructive hover:underline flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
