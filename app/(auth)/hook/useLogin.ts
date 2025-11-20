"use client";

import { useState, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/types/Login";

const loginFormSchema = z
  .object({
    email: z.string(),
    phone: z.string(),
    password: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasEmail = data.email.trim() !== "";
    const hasPhone = data.phone.trim() !== "";
    const hasPassword = data.password.trim() !== "";

    // Require exactly one login method
    if (!hasEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
        path: ["email"],
      });
      if (!hasPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required",
          path: ["password"],
        });
      }
    }
    if (!hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number is required.",
        path: ["phone"],
      });
    }

    if (hasEmail && hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please use either email or phone number, not both",
        path: ["phone"],
      });
      return;
    }

    // Email flow
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
          message: "Password is required",
          path: ["password"],
        });
      }
    }

    // Phone flow - OTP based, no password required
    if (hasPhone) {
      const digits = data.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be at least 10 digits",
          path: ["phone"],
        });
      }
      // Password not required for phone login (uses OTP instead)
    }
  });

export type LoginForm = UseFormReturn<LoginFormValues>;

export function useLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", phone: "", password: "" },
    mode: "all",
  });

  const updateLoginMethod = useCallback(
    (method: "email" | "phone") => {
      setLoginMethod(method);
      form.clearErrors();

      if (method === "email") {
        form.setValue("phone", "");
      } else if (method === "phone") {
        form.setValue("email", "");
        form.setValue("password", "");
      }
    },
    [form]
  );

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);

    try {
      const hasEmail = data.email.trim() !== "";
      const hasPhone = data.phone.trim() !== "";

      const actualMethod = hasEmail
        ? "email"
        : hasPhone
        ? "phone"
        : loginMethod;

      const result = await signIn("credentials", {
        emailOrPhone: actualMethod === "email" ? data.email : data.phone,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        let message = "Invalid credentials. Please try again.";
        
        // Handle specific error messages
        if (result.error === "User not found") {
          message = "No account found with this email address.";
        } else if (result.error === "Invalid credentials") {
          message = "Invalid email or password.";
        } else if (result.error === "Account suspended") {
          message = "Your account has been suspended. Please contact support.";
        } else if (result.error.includes("required")) {
          message = result.error;
        } else {
          message = result.error;
        }

        form.setError("root", { type: "manual", message });
        return;
      }

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      if (err instanceof Error && err.message) {
        message = err.message;
      }

      form.setError("root", { type: "manual", message });
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, onSubmit, loginMethod, updateLoginMethod };
}

export default useLogin;
