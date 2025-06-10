import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios from "axios";
import * as z from "zod";
import { toast } from "sonner";
import { useProfile } from "@/app/profile/hook/useProfile";
import useIPStackLocation from "@/hook/useIPStackLocation";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(["male", "female", "other", ""]),
  birthday: z.coerce.date(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("India"),
  role: z.string().optional(),
  accountStatus: z.string().optional(),
});

export const useEditProfile =(initialValues) => {
  const { locationData } = useIPStackLocation();

  const detectedCountryCode = locationData?.country_code || "IN";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      birthday: new Date(),
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      role: "",
      accountStatus: "active",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        firstName: initialValues.firstName || "",
        lastName: initialValues.lastName || "",
        email: initialValues.email || "",
        phone: initialValues.phone || "",
        gender: initialValues.gender || "",
        birthday: initialValues.birthday
          ? new Date(initialValues.birthday)
          : new Date(),
        address1: initialValues.address1 || "",
        address2: initialValues.address2 || "",
        city: initialValues.city || "",
        state: initialValues.state || "",
        zipCode: initialValues.zipCode || "",
        country: initialValues.country || "India",
        role: initialValues.role || "",
        accountStatus: initialValues.accountStatus || "active",
      });
    }
  }, [initialValues, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      await axios.put("/api/user/edit-profile", values);
      toast.success("Profile updated successfully!");
      // const { refetch } = useProfile(userId);
      // await refetch();
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    error,
    country_code: detectedCountryCode,
  };
}
