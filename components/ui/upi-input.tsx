"use client";

import * as React from "react";
import { XIcon } from "./x";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
    { value: "@ybl", label: "Yes Bank (YBL)" },
    { value: "@ybi", label: "Yes Bank (YBI)" },
    { value: "@axl", label: "Axis Bank" },
    { value: "@ibl", label: "IDBI Bank" },
    { value: "@okaxis", label: "OK Axis" },
    { value: "@oksbi", label: "OK SBI" },
    { value: "@okhdfc", label: "OK HDFC" },
    { value: "@okicici", label: "OK ICICI" },
    { value: "@okidfcbank", label: "OK IDFC" },
    { value: "@okyesbank", label: "OK Yes Bank" },
    { value: "@upi", label: "Generic UPI" },
    { value: "@sbi", label: "State Bank of India" },
    { value: "@icici", label: "ICICI Bank" },
    { value: "@hsbc", label: "HSBC" },
    { value: "@sc", label: "Standard Chartered" },
];

const POPULAR_SUFFIXES = [
    { value: "@oksbi", label: "SBI" },
    { value: "@okhdfc", label: "HDFC" },
    { value: "@okaxis", label: "Axis" },
    { value: "@okicici", label: "ICICI" },
    { value: "@ybl", label: "YBL" },
    { value: "@ybi", label: "YBI" },
    { value: "@paytm", label: "Paytm" },
    { value: "@upi", label: "UPI" },
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
        const username = value.split("@")[0].trim();
        if (!username) {
            return; // Don't add suffix if username is empty
        }
        const newValue = username + provider;
        onChange(newValue);
        setOpen(false);
    };

    const handleRemoveSuffix = () => {
        const username = value.split("@")[0];
        onChange(username);
    };

    const currentSuffix = value.includes("@") ? "@" + value.split("@")[1] : null;

    const filteredProviders = UPI_PROVIDERS.filter((provider) => {
        const searchTerm = value.toLowerCase();
        return (
            provider.label.toLowerCase().includes(searchTerm) ||
            provider.value.toLowerCase().includes(searchTerm)
        );
    });

    const showSuggestions = Boolean(value && !value.includes("@"));

    return (
        <div className="relative w-full">
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

            <Popover open={open && showSuggestions} onOpenChange={setOpen}>
                <PopoverContent className="w-full p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <div className="border-b p-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Popular UPI suffixes</p>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_SUFFIXES.map((suffix) => (
                                <Badge
                                    key={suffix.value}
                                    variant="secondary"
                                    className="cursor-pointer"
                                    onClick={() => handleProviderSelect(suffix.value)}
                                >
                                    <span className="font-medium mr-1">{suffix.label}</span>
                                    <span className="text-muted-foreground">{suffix.value}</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
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

            {/* Inline quick badges for Indian UPI suffixes */}
            <div className="my-4">
                <div className="flex flex-wrap gap-2">
                    {UPI_PROVIDERS.map((provider) => (
                        <Badge
                            key={`inline-${provider.value}`}
                            variant={currentSuffix === provider.value ? "default" : "secondary"}
                            className={`cursor-pointer hover:opacity-80 ${currentSuffix === provider.value ? "rounded-full pr-1 gap-1.5" : ""
                                }`}
                            color={currentSuffix === provider.value ? "danger" : "default"}
                            onClick={() =>
                                currentSuffix === provider.value
                                    ? undefined
                                    : handleProviderSelect(provider.value)
                            }
                        >
                            <span>{provider.value}</span>
                            {currentSuffix === provider.value && (
                                <XIcon className="h-3 w-3 cursor-pointer" onClick={handleRemoveSuffix} />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}