import { z } from "zod";

export const addressSchema = z.object({
    address1: z.string().min(1, "Address Line 1 is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(5, "ZIP Code must be at least 5 characters"),
    country: z.string().min(1, "Country is required"),
    landmark: z.string().optional(),
    addressType: z.enum(["home", "work", "other"]),
    isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
