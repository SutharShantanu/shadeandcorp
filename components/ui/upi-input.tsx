"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface UpiInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const UPI_PROVIDERS = [
    { value: "@paytm", label: "Paytm" },
    { value: "@phonepe", label: "PhonePe" },
    { value: "@googlepay", label: "Google Pay" },
    { value: "@ybl", label: "Yes Bank (PhonePe)" },
    { value: "@axl", label: "Axis Bank" },
    { value: "@upi", label: "Generic UPI" },
    { value: "@okaxis", label: "OK Axis" },
    { value: "@oksbi", label: "OK SBI" },
    { value: "@okicici", label: "OK ICICI" },
    { value: "@okhdfc", label: "OK HDFC" },
    { value: "@ibl", label: "IDBI Bank" },
    { value: "@sbi", label: "State Bank of India" },
    { value: "@icici", label: "ICICI Bank" },
    { value: "@hsbc", label: "HSBC" },
    { value: "@sc", label: "Standard Chartered" },
];

export function UpiInput({ value, onChange, placeholder = "username@upi", disabled = false }: UpiInputProps) {
    const [open, setOpen] = React.useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Auto-open suggestions when typing without @
        const hasAt = newValue.includes("@");
        if (!hasAt && newValue.length > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const handleProviderSelect = (provider: string) => {
        const username = value.split("@")[0];
        const newValue = username + provider;
        onChange(newValue);
        setOpen(false);
    };

    const filteredProviders = UPI_PROVIDERS.filter((provider) => {
        const searchTerm = value.toLowerCase();
        return (
            provider.label.toLowerCase().includes(searchTerm) ||
            provider.value.toLowerCase().includes(searchTerm)
        );
    });

    const showSuggestions = Boolean(value && !value.includes("@"));

    return (
        <Popover open={open && showSuggestions} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Input
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (value && !value.includes("@")) {
                            setOpen(true);
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => setOpen(false), 200);
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full"
                />
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                    <CommandList>
                        <CommandEmpty>No UPI provider found.</CommandEmpty>
                        <CommandGroup heading="Select UPI Provider">
                            {filteredProviders.map((provider) => (
                                <CommandItem
                                    key={provider.value}
                                    value={provider.value}
                                    onSelect={() => handleProviderSelect(provider.value)}
                                    className="cursor-pointer"
                                >
                                    <span className="font-medium">{provider.label}</span>
                                    <span className="text-muted-foreground ml-auto text-sm">{provider.value}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
