"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrPhone: "", password: "" },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        emailOrPhone: data.emailOrPhone,
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

  return { form, loading, onSubmit };
}

export default useLogin;
