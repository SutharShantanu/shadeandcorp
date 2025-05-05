"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import useIPStackLocation from "@/hook/useIPStackLocation";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password confirmation is required"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const location = useIPStackLocation();
  const { country_code, country_name } = location?.locationData || {
    country_code: "IN",
    country_name: "India",
  };

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      const finalPayload = {
        ...payload,
        country: country_name,
        countryCode: country_code,
      };

      const response = await axios.post("/api/users/signup", finalPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Signup successful!");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    countryCode: country_code,
  };
};
