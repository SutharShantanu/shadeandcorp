"use client";

import { useId } from "react";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { type CardImages } from "react-payment-inputs/images";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreditCardInputProps {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardHolderName: string;
    onCardNumberChange: (value: string) => void;
    onExpiryDateChange: (value: string) => void;
    onCVCChange: (value: string) => void;
    onCardHolderNameChange?: (value: string) => void;
    disabled?: boolean;
}

export function CreditCardInput({
    cardNumber,
    expiryDate,
    cvc,
    cardHolderName,
    onCardNumberChange,
    onExpiryDateChange,
    onCVCChange,
    onCardHolderNameChange,
    disabled = false,
}: CreditCardInputProps) {
    const id = useId();
    const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, getCardImageProps } = usePaymentInputs();

    // Format card number with spaces for display
    const formatCardNumber = (num: string) => {
        const cleaned = num.replace(/\s/g, "");
        if (!cleaned) return "•••• •••• •••• ••••";
        const groups = cleaned.match(/.{1,4}/g) || [];
        const formatted = groups.join(" ");
        const remaining = 19 - formatted.length; // 16 digits + 3 spaces = 19 chars
        return formatted + "•".repeat(Math.max(0, remaining)).replace(/(.{4})/g, "$1 ").trim();
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
        <div className="w-full space-y-4">
            {/* Visual Credit Card Display */}
            <div className="relative mx-auto w-full max-w-md">
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
                            <div className="h-10 w-12 rounded bg-linear-to-br from-yellow-200 to-yellow-400 shadow-lg">
                                <svg viewBox="0 0 48 40" className="h-full w-full p-1">
                                    <rect x="4" y="4" width="40" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-700" />
                                    <rect x="12" y="12" width="24" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-700" />
                                </svg>
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

            {/* Input Fields */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor={`holder-${id}`}>Cardholder Name</Label>
                    <Input
                        id={`holder-${id}`}
                        value={cardHolderName}
                        onChange={(e) => onCardHolderNameChange?.(e.target.value)}
                        disabled={disabled}
                        placeholder="John Doe"
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor={`number-${id}`}>Card Number</Label>
                    <div className="relative mt-1.5">
                        <Input
                            {...getCardNumberProps({
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => onCardNumberChange(e.target.value),
                            })}
                            id={`number-${id}`}
                            value={cardNumber}
                            disabled={disabled}
                            placeholder="1234 5678 9012 3456"
                            className="pr-10"
                        />
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3">
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
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`expiry-${id}`}>Expiry Date</Label>
                        <Input
                            {...getExpiryDateProps({
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => onExpiryDateChange(e.target.value),
                            })}
                            id={`expiry-${id}`}
                            value={expiryDate}
                            disabled={disabled}
                            placeholder="MM/YY"
                            className="mt-1.5"
                        />
                    </div>
                    <div>
                        <Label htmlFor={`cvc-${id}`}>CVC</Label>
                        <Input
                            {...getCVCProps({
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => onCVCChange(e.target.value),
                            })}
                            id={`cvc-${id}`}
                            value={cvc}
                            disabled={disabled}
                            placeholder="123"
                            className="mt-1.5"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
