"use client";

import { useState, useCallback } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export type LoginFormValues = {
  email: string;
  phone: string;
  password: string;
};

// Custom schema for login form with separate email/phone fields
const loginFormSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type LoginForm = UseFormReturn<LoginFormValues, any, LoginFormValues>;

export function useLogin() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues, any, LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", phone: "", password: "" },
    mode: "onSubmit",
  });

  const updateLoginMethod = useCallback(
    (method: "email" | "phone") => {
      setLoginMethod(method);
      form.clearErrors();

      if (method === "email") {
        form.setValue("phone", "");
      } else if (method === "phone") {
        form.setValue("email", "");
      }
    },
    [form]
  );

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    try {
      // Validate based on login method
      if (loginMethod === "email") {
        if (!data.email || data.email.trim() === "") {
          form.setError("email", { type: "manual", message: "Email is required" });
          setLoading(false);
          return;
        }
        const emailCheck = z.string().email().safeParse(data.email);
        if (!emailCheck.success) {
          form.setError("email", { type: "manual", message: "Please enter a valid email address" });
          setLoading(false);
          return;
        }
      } else {
        if (!data.phone || data.phone.trim() === "") {
          form.setError("phone", { type: "manual", message: "Phone number is required" });
          setLoading(false);
          return;
        }
        const digits = data.phone.replace(/\D/g, "");
        if (digits.length < 10) {
          form.setError("phone", { type: "manual", message: "Phone number must be at least 10 digits" });
          setLoading(false);
          return;
        }
      }

      // Combine email or phone into emailOrPhone for backend
      const emailOrPhone = loginMethod === "email" ? data.email : data.phone;

      const result = await signIn("credentials", {
        emailOrPhone,
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
