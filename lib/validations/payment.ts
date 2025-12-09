import { z } from "zod";

export const paymentMethodSchema = z.object({
    type: z.enum(["credit-card", "debit-card", "upi", "net-banking"]),
    cardHolderName: z.string().min(1, "Name is required"),
    cardNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    cvc: z.string().optional(),
    upiId: z.string().optional(),
    accountNumber: z.string().optional(),
    isDefault: z.boolean(),
}).superRefine((data, ctx) => {
    // Validate card fields for credit/debit cards
    if (data.type === "credit-card" || data.type === "debit-card") {
        if (!data.cardNumber || data.cardNumber.length < 13) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Valid card number is required",
                path: ["cardNumber"],
            });
        }
        if (!data.expiryDate || data.expiryDate.length < 4) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Valid expiry date is required",
                path: ["expiryDate"],
            });
        }
        if (!data.cvc || data.cvc.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Valid CVC is required (3-4 digits)",
                path: ["cvc"],
            });
        }
    }

    // Validate UPI ID
    if (data.type === "upi") {
        if (!data.upiId || !data.upiId.includes("@")) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Valid UPI ID is required.",
                path: ["upiId"],
            });
        }
    }

    // Validate account number for net-banking
    if (data.type === "net-banking") {
        if (!data.accountNumber) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Account number is required",
                path: ["accountNumber"],
            });
        }
    }
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
