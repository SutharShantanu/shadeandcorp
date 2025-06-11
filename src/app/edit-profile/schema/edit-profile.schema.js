import { GenderEnum } from "@/app/models/enums/users.enum";
import { z } from "zod";

// --- Personal Info Schema ---
export const personalInfoSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(Object.values(GenderEnum).filter(Boolean), {
    required_error: "Gender is required",
    invalid_type_error: "Gender is required",
  }),
  birthday: z.coerce.date(),
});

// --- Address Schema ---
export const addressSchema = z
  .object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().nonempty("Country is required"),
  })
  .refine(
    (data) =>
      data.address1 || data.address2 || data.city || data.state || data.zipCode,
    {
      message: "At least one address field is required",
      path: ["address1"], // you can point to any field
    }
  );

// --- Account Settings Schema ---
export const accountSettingsSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- Full Schema ---
export const fullSchema = personalInfoSchema.merge(addressSchema).merge(
  z.object({
    accountStatus: z.string().optional(),
  })
);
