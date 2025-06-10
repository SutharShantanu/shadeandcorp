import { DefaultValues, GenderEnum } from "@/app/models/enums/users.enum";
import { z } from "zod";

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

export const addressSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default(DefaultValues.COUNTRY),
});

export const accountSettingsSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const fullSchema = personalInfoSchema.merge(addressSchema).merge(
  z.object({
    accountStatus: z.string().optional(),
  })
);
