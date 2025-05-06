"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import useIPStackLocation from "@/hook/useIPStackLocation";
import { parsePhoneNumber } from "react-phone-number-input"; // Import the parsing function

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

  const { locationData, locationLoading } = useIPStackLocation();

  const detectedCountryCode = locationData?.country_code || "";
  const country_name = locationData?.country_name || "";
  const detectedCallingCode = locationData?.location?.calling_code || "";

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
    const { confirmPassword, phone, ...payload } = data;

    let parsedPhoneNumber;
    try {
      parsedPhoneNumber = parsePhoneNumber(phone);
    } catch (error) {
      console.error("Error parsing phone number:", error);
      toast.error("Invalid phone number format");
      setLoading(false);
      return;
    }
    let userProvidedCountryCode =
      parsedPhoneNumber?.countryCallingCode || detectedCountryCode;
    const nationalNumber = parsedPhoneNumber?.nationalNumber;

    const finalPayload = {
      ...payload,
      phone: nationalNumber,
      country: country_name,
      countryCode: userProvidedCountryCode,
    };

    try {
      const response = await axios.post("/api/users/signup", finalPayload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Signup successful!");
      } else if (response.data?.error) {
        toast.error(response.data.error);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      const apiError =
        error.response?.data?.error || error.response?.data?.message;
      if (apiError) {
        toast.error(apiError);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    countryCode: detectedCountryCode,
  };
};
