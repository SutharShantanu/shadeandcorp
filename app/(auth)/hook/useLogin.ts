"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.status === 200) {
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      let message = "Invalid credentials or server error. Please try again.";

      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          typeof (data as { message?: unknown }).message === "string"
        ) {
          message = (data as { message: string }).message;
        } else if (err.message) {
          message = err.message;
        }
      } else if (err instanceof Error && err.message) {
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
