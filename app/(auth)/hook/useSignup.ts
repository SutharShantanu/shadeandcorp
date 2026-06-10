"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().optional(),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    const password = data.password || "";

    if (!password) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Password is required", path: ["password"] });
    } else {
      // Enhanced password validation
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
  });

export type EmailSignupFormValues = z.infer<typeof signupSchema>;
export type SignupForm = UseFormReturn<EmailSignupFormValues>;

export function useSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailSignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: EmailSignupFormValues) {
    setLoading(true);

    try {
      const submitData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
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

      // Auto sign-in
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
  };
}

export default useSignup;
