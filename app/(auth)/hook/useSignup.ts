"use client";

import { useState, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BaseFormValues } from "@/types/Signup";

// Schema allows exactly one method: email+password OR phone (OTP handled separately)
const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().trim(),
    phone: z.string().trim(),
    password: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    const email = data.email?.trim() || "";
    const phone = data.phone?.trim() || "";
    const password = data.password?.trim() || "";

    const hasEmail = email.length > 0;
    const hasPhone = phone.length > 0;

    // Require exactly one method
    if (!hasEmail && !hasPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email or phone is required", path: ["email"] });
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email or phone is required", path: ["phone"] });
      return;
    }

    if (hasEmail && hasPhone) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please use either email or phone number, not both", path: ["phone"] });
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please use either email or phone number, not both", path: ["email"] });
      return;
    }

    // Email flow requires password and valid email
    if (hasEmail) {
      const emailCheck = z.string().email().safeParse(email);
      if (!emailCheck.success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["email"] });
      }

      if (!password) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password is required for email signup", path: ["password"] });
      } else {
        // Enhanced password validation (like SecurityTab)
        if (password.length < 8) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must be at least 8 characters", path: ["password"] });
        }
        if (!/[A-Z]/.test(password)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must include an uppercase letter", path: ["password"] });
        }
        if (!/[a-z]/.test(password)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must include a lowercase letter", path: ["password"] });
        }
        if (!/[0-9]/.test(password)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must include a number", path: ["password"] });
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Must include a symbol", path: ["password"] });
        }
      }
    }

    // Phone flow requires valid phone number; password is ignored in this path
    if (hasPhone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number must be at least 10 digits", path: ["phone"] });
      }
    }
  });

export type SignupForm = UseFormReturn<BaseFormValues, any, BaseFormValues>;

export function useSignup() {
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<"email" | "phone" | null>(
    "email"
  );
  const [loading, setLoading] = useState(false);

  const form = useForm<BaseFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onChange", // Real-time validation like SecurityTab
  });

  const updateSignupMethod = useCallback(
    (method: "email" | "phone" | null) => {
      setSignupMethod(method);
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

  async function onSubmit(data: BaseFormValues) {
    setLoading(true);

    try {
      const hasEmail = data.email.trim() !== "";
      const hasPhone = data.phone.trim() !== "";

      const actualMethod = hasEmail
        ? "email"
        : hasPhone
          ? "phone"
          : signupMethod;

      if (!actualMethod) {
        form.setError("root", {
          type: "manual",
          message: "Please choose a signup method",
        });
        return false;
      }

      const submitData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: actualMethod === "email" ? data.email : undefined,
        phone: actualMethod === "phone" ? data.phone : undefined,
        password:
          actualMethod === "email" ? data.password : "temporary-password", // ignored for phone
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const json = await res.json();

      if (!res.ok) {
        form.setError("root", {
          type: "manual",
          message: json?.error || "Registration failed. Please try again.",
        });
        return false;
      }

      // Auto sign-in for email signup
      if (actualMethod === "email") {
        const result = await signIn("credentials", {
          redirect: false,
          emailOrPhone: data.email,
          password: data.password,
        });

        if (result?.error) {
          form.setError("root", {
            type: "manual",
            message:
              "Registration succeeded but sign-in failed. Please log in manually.",
          });
          return false;
        }

        router.push("/");
        router.refresh();
      } else {
        router.push("/login?message=registration-success");
      }

      return true;
    } catch (err) {
      console.error("Signup error:", err);
      form.setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    onSubmit,
    signupMethod,
    updateSignupMethod,
  };
}

export default useSignup;
