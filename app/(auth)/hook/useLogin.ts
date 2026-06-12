"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginFormValues } from "@/types/Login";

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

// Create a new type since we removed phone from the schema
export type EmailLoginFormValues = z.infer<typeof loginFormSchema>;
export type LoginForm = UseFormReturn<EmailLoginFormValues>;

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmailLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onChange",
  });

  async function onSubmit(data: EmailLoginFormValues) {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        emailOrPhone: data.email, // The backend still expects emailOrPhone
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
        return false;
      }

      if (result?.ok) {
        if (data.rememberMe && 'PasswordCredential' in window) {
          try {
            const cred = new (window as any).PasswordCredential({
              id: data.email,
              password: data.password,
              name: data.email,
            });
            await navigator.credentials.store(cred);
          } catch (e) {
            console.error("Failed to store credentials", e);
          }
        }

        router.push("/");
        router.refresh();
        return true;
      }
      return false;
    } catch (err: unknown) {
      let message = "An unexpected error occurred. Please try again.";

      if (err instanceof Error && err.message) {
        message = err.message;
      }

      form.setError("root", { type: "manual", message });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { form, loading, onSubmit };
}

export default useLogin;
