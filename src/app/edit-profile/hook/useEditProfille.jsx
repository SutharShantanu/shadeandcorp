// hooks/useEditProfileForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    gender: z.enum(["male", "female", "other", "don't know"]),
    birthday: z.coerce.date(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default("India"),
});

export function useEditProfile () {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gender: "don't know",
            birthday: new Date(),
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipCode: "",
            country: "India",
        },
    });

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            await axios.put("/api/user/profile", values);
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        onSubmit,
        loading,
    };
}
