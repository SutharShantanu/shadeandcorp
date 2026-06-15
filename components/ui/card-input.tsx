"use client";

import { useId, useState } from "react";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { type CardImages } from "react-payment-inputs/images";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type CardFieldNames<TFormValues extends FieldValues> = {
    cardHolderName: Path<TFormValues>;
    cardNumber: Path<TFormValues>;
    expiryDate: Path<TFormValues>;
    cvc: Path<TFormValues>;
};

interface CardInputProps<TFormValues extends FieldValues> {
    form: UseFormReturn<TFormValues>;
    fieldNames: CardFieldNames<TFormValues>;
    cardType?: "credit-card" | "debit-card";
    disabled?: boolean;
    onCardNumberChange?: (value: string) => void;
    onExpiryDateChange?: (value: string) => void;
    onCVCChange?: (value: string) => void;
    onCardHolderNameChange?: (value: string) => void;
}

export function CardInput<TFormValues extends FieldValues>({
    form,
    fieldNames,
    cardType = "credit-card",
    disabled = false,
    onCardNumberChange,
    onExpiryDateChange,
    onCVCChange,
    onCardHolderNameChange,
}: CardInputProps<TFormValues>) {
    const id = useId();
    const [cvcLabel, setCvcLabel] = useState<"CVC" | "CCV">("CVC");
    const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, getCardImageProps } = usePaymentInputs();
    const cardHolderName = form.watch(fieldNames.cardHolderName) as string;
    const cardNumber = form.watch(fieldNames.cardNumber) as string;
    const expiryDate = form.watch(fieldNames.expiryDate) as string;

    // Format card number in 4-digit groups; pad with bullets to nearest group for a steady layout
    const formatCardNumber = (num: string) => {
        const cleaned = num.replace(/\D/g, "");
        if (!cleaned) return "•••• •••• •••• ••••";
        const targetLength = Math.min(20, Math.max(16, Math.ceil(cleaned.length / 4) * 4));
        const padded = cleaned.padEnd(targetLength, "•");
        const groups = padded.match(/.{1,4}/g) || [];
        return groups.join(" ");
    };

    // Detect card brand color
    const getCardColor = () => {
        if (!meta.cardType) return "from-slate-700 to-slate-900";

        switch (meta.cardType.displayName) {
            case "Visa":
                return "from-blue-600 to-blue-800";
            case "Mastercard":
                return "from-orange-500 to-red-600";
            case "American Express":
                return "from-teal-600 to-blue-700";
            case "Discover":
                return "from-orange-600 to-orange-800";
            default:
                return "from-slate-700 to-slate-900";
        }
    };

    return (
        <div className="w-full flex items-center gap-8 space-y-4">

            {/* Input Fields with FormField wrappers */}
            <div className="flex flex-col gap-2 w-1/2">
                <FormField
                    control={form.control}
                    name={fieldNames.cardHolderName}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={`holder-${id}`} required>Cardholder Name</FormLabel>
                            <FormControl>
                                <Input
                                    id={`holder-${id}`}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        onCardHolderNameChange?.(e.target.value);
                                    }}
                                    disabled={disabled}
                                    placeholder="John Doe"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={fieldNames.cardNumber}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor={`number-${id}`} required>Card Number</FormLabel>
                            <FormControl>
                                <InputGroup>
                                    <InputGroupInput
                                        {...getCardNumberProps({
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 19);
                                                field.onChange(digitsOnly);
                                                onCardNumberChange?.(digitsOnly);
                                            },
                                        })}
                                        id={`number-${id}`}
                                        value={((field.value as string) || "").replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")}
                                        disabled={disabled}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        {meta.cardType ? (
                                            <svg
                                                className="h-6 w-8"
                                                {...getCardImageProps({
                                                    images: images as unknown as CardImages,
                                                })}
                                            />
                                        ) : (
                                            <CreditCardIcon className="size-4" />
                                        )}
                                    </InputGroupAddon>
                                </InputGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4 items-end">
                    <FormField
                        control={form.control}
                        name={fieldNames.expiryDate}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor={`expiry-${id}`} required>Expiry Date</FormLabel>
                                <FormControl>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...getExpiryDateProps({
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                    field.onChange(e.target.value);
                                                    onExpiryDateChange?.(e.target.value);
                                                },
                                            })}
                                            id={`expiry-${id}`}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            placeholder="MM/YY"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={fieldNames.cvc}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel htmlFor={`cvc-${id}`}>{cvcLabel}</FormLabel>
                                    <Select value={cvcLabel} onValueChange={(value) => setCvcLabel(value as "CVC" | "CCV")} defaultValue="CVC">
                                        <SelectTrigger className="h-6 w-fit text-xs">
                                            <SelectValue placeholder="CVC" />
                                        </SelectTrigger>
                                        <SelectContent align="end">
                                            <SelectItem value="CVC">CVC</SelectItem>
                                            <SelectItem value="CCV">CCV</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormControl>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...getCVCProps({
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                    field.onChange(e.target.value);
                                                    onCVCChange?.(e.target.value);
                                                },
                                            })}
                                            id={`cvc-${id}`}
                                            value={field.value || ""}
                                            disabled={disabled}
                                            placeholder="123"
                                        />
                                    </InputGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Visual Credit Card Display */}
            <div className="relative mx-auto w-1/2 max-w-md">
                <div
                    className={`relative aspect-[1.586/1] w-full rounded-2xl bg-linear-to-br ${getCardColor()} p-6 text-white shadow-2xl transition-all duration-300`}
                >
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white"></div>
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white"></div>
                    </div>

                    {/* Card Content */}
                    <div className="relative flex h-full flex-col justify-between">
                        {/* Chip and Logo */}
                        <div className="flex items-start justify-between">
                            <div className="h-10 w-12 rounded bg-linear-to-br from-amber-200 to-amber-400 shadow-lg">
                                <svg viewBox="0 0 48 40" className="h-full w-full p-1">
                                    <rect x="4" y="4" width="40" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-700" />
                                    <rect x="12" y="12" width="24" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-700" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm">
                                    {cardType === "credit-card" ? "Credit" : "Debit"}
                                </div>
                                <div className="flex h-8 items-center justify-center">
                                    {meta.cardType ? (
                                        <svg
                                            className="h-8 w-12"
                                            {...getCardImageProps({
                                                images: images as unknown as CardImages,
                                            })}
                                        />
                                    ) : (
                                        <CreditCardIcon className="h-8 w-8 opacity-50" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card Number */}
                        <div className="space-y-4">
                            <div className="text-center font-mono text-xl tracking-widest sm:text-2xl">
                                {formatCardNumber(cardNumber)}
                            </div>

                            {/* Card Holder and Expiry */}
                            <div className="flex items-end justify-between text-xs sm:text-sm">
                                <div className="flex-1">
                                    <div className="mb-1 text-[10px] uppercase tracking-wider opacity-70">
                                        Card Holder
                                    </div>
                                    <div className="truncate font-medium uppercase">
                                        {cardHolderName || "YOUR NAME"}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-1 text-[10px] uppercase tracking-wider opacity-70">
                                        Expires
                                    </div>
                                    <div className="font-mono font-medium">
                                        {expiryDate || "MM/YY"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
