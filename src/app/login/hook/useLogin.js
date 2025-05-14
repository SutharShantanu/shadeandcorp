"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("result", result);

      // if (result?.error) {
      //   toast.error(result.error);
      // } else {
      //   toast.success("Login successful!");
      //   // router.push("/");
      // }
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, onSubmit };
};
