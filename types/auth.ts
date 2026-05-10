import { z } from "zod";
import type { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { parsePhoneNumber } from "libphonenumber-js";

// LOGIN SCHEMA
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// REGISTER SCHEMA

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),

    password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasEmail = typeof data.email === "string" && data.email.trim() !== "";
    const hasPhone = typeof data.phone === "string" && data.phone.trim() !== "";
    const hasPassword = typeof data.password === "string" && data.password.trim() !== "";

    // REQUIRE: at least 1 method
    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either email or phone number is required",
        path: ["email"],
      });
      return;
    }

    // NOT BOTH
    if (hasEmail && hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please use either email or phone number, not both",
        path: ["phone"],
      });
      return;
    }

    // EMAIL SIGNUP
    if (hasEmail) {
      const emailCheck = z.string().email().safeParse(data.email);
      if (!emailCheck.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
          path: ["email"],
        });
      }

      if (!hasPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required for email signup",
          path: ["password"],
        });
      } else {
        if (data.password!.length < 6)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must be at least 6 characters",
            path: ["password"],
          });

        if (!/[A-Z]/.test(data.password!))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one uppercase letter",
            path: ["password"],
          });

        if (!/[0-9]/.test(data.password!))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one number",
            path: ["password"],
          });

        if (!/[^A-Za-z0-9]/.test(data.password!))
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password must contain at least one special character",
            path: ["password"],
          });
      }
    }

    // PHONE SIGNUP
    if (hasPhone) {
      try {
        const phoneObj = parsePhoneNumber(data.phone!);
        if (!phoneObj.isValid()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter a valid phone number",
            path: ["phone"],
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid phone number",
          path: ["phone"],
        });
      }
    }
  });

// Login response type
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  error?: string;
}

// NEXTAUTH TYPES
