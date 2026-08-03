"use client";

import * as React from "react";
import { format, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

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

export interface DropdownDatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  maxDate?: Date;
  minDate?: Date;
  className?: string;
  placeholder?: string;
}

export function DropdownDatePicker({
  date,
  setDate,
  maxDate = new Date(),
  minDate = new Date(1900, 0, 1),
  className,
  placeholder = "Pick a date",
}: DropdownDatePickerProps) {
  const [selectedMonth, setSelectedMonth] = React.useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const startYear = minDate.getFullYear();
  const endYear = maxDate.getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => endYear - i
  );

  const handleMonthChange = (monthStr: string) => {
    const month = parseInt(monthStr, 10);
    setSelectedMonth(month);
    if (date) {
      const updated = setMonth(date, month);
      setDate(updated);
    }
  };

  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    setSelectedYear(year);
    if (date) {
      const updated = setYear(date, year);
      setDate(updated);
    }
  };

  const displayDate = React.useMemo(() => {
    if (!date) return undefined;
    return new Date(selectedYear, selectedMonth, date.getDate());
  }, [date, selectedYear, selectedMonth]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="flex gap-2 mb-3">
          <Select
            value={selectedMonth.toString()}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, idx) => (
                <SelectItem key={m} value={idx.toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={new Date(selectedYear, selectedMonth)}
          onMonthChange={(d) => {
            setSelectedMonth(d.getMonth());
            setSelectedYear(d.getFullYear());
          }}
          disabled={(d) => d > maxDate || d < minDate}
        />
      </PopoverContent>
    </Popover>
  );
}
