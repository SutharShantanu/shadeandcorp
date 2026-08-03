"use client";

import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";

// Profile form schemas for each tab
export const profileSchema = z.object({
  firstName: z.string().min(1, "Username is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  urls: z.array(z.string().url("Invalid URL").or(z.literal(""))).optional(),
  profilePicture: z.string().optional(),
});

export const accountSchema = z.object({
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(),
});

export const billingSchema = z.object({
  // Add billing fields as needed
});

export const appearanceSchema = z.object({
  // Add appearance fields as needed
});

export const notificationsSchema = z.object({
  // Add notification fields as needed
});

export const displaySchema = z.object({
  // Add display fields as needed
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type AccountFormValues = z.infer<typeof accountSchema>;
export type BillingFormValues = z.infer<typeof billingSchema>;
export type AppearanceFormValues = z.infer<typeof appearanceSchema>;
export type NotificationsFormValues = z.infer<typeof notificationsSchema>;
export type DisplayFormValues = z.infer<typeof displaySchema>;

export type ProfileForm = UseFormReturn<ProfileFormValues>;
export type AccountForm = UseFormReturn<AccountFormValues>;

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  countryCode?: string;
  profilePicture?: string;
  gender?: string;
  birthday?: string;
  bio?: string;
  urls?: string[];
  addresses?: any[];
  paymentMethods?: any[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: string;
  accountStatus?: string;
  sessions?: {
    ipAddress?: string;
    city?: string;
    country?: string;
    deviceInfo?: string;
    loggedInAt?: string;
  }[];
  joinDate: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useProfile() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      urls: [],
      profilePicture: "",
    },
    mode: "onChange",
  });

  // Account form
  const accountForm = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      phone: "",
      countryCode: "91",
      gender: "",
      birthday: "",
    },
    mode: "onChange",
  });

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.id) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        const response = await fetch("/api/user/profile");
        const data = await response.json();

        if (data.ok && data.user) {
          const user = data.user;
          setUserProfile(user);

          // Populate profile form
          profileForm.reset({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            bio: user.bio || "",
            urls: user.urls || [],
            profilePicture: user.profilePicture || "",
          });

          // Populate account form
          accountForm.reset({
            phone: user.phone || "",
            countryCode: user.countryCode || "91",
            gender: user.gender || "",
            birthday: user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "",
          });
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Failed to fetch profile");
      } finally {
        setFetching(false);
      }
    }

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Update profile
  async function updateProfile(
    formData: ProfileFormValues | AccountFormValues,
    tab: string
  ) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.ok) {
        // Update local state
        if (data.user) {
          setUserProfile((prev) => (prev ? { ...prev, ...data.user } : data.user));

          // Update NextAuth session to refresh user data from database
          await update();
        }
        return { success: true, message: data.message || "Profile updated successfully" };
      } else {
        setError(data.error || "Failed to update profile");
        return { success: false, error: data.error || "Failed to update profile" };
      }
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  // Add a new address
  async function addAddress(data: Record<string, any>) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.ok) {
        // Refresh full profile to get the MongoDB _id of the new address
        const profileRes = await fetch("/api/user/profile");
        const profileData = await profileRes.json();
        if (profileData.ok && profileData.user) {
          setUserProfile(profileData.user);
        }
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Failed to add address");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add address";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  // Update an existing address
  async function updateAddress(addressId: string, data: Record<string, any>) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/profile/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId, ...data }),
      });
      const result = await response.json();
      if (result.ok) {
        // Refresh profile to get latest addresses
        const profileRes = await fetch("/api/user/profile");
        const profileData = await profileRes.json();
        if (profileData.ok && profileData.user) {
          setUserProfile(profileData.user);
        }
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Failed to update address");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update address";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  // Delete an address
  async function deleteAddress(addressId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/user/profile/addresses?addressId=${addressId}`,
        { method: "DELETE" }
      );
      const result = await response.json();
      if (result.ok) {
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                addresses: (prev.addresses || []).filter(
                  (a: any) => a._id?.toString() !== addressId
                ),
              }
            : prev
        );
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Failed to delete address");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete address";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  // Set an address as default
  async function setDefaultAddress(addressId: string) {
    return updateAddress(addressId, { isDefault: true });
  }

  // Delete a specific session
  async function deleteSession(sessionIndex: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/profile/sessions?index=${sessionIndex}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.ok) {
        setUserProfile((prev) =>
          prev ? { ...prev, sessions: result.sessions } : prev
        );
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Failed to log out session");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to log out session";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  // Delete all other sessions
  async function deleteAllOtherSessions() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/profile/sessions?action=all_others", {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.ok) {
        setUserProfile((prev) =>
          prev ? { ...prev, sessions: result.sessions } : prev
        );
        return { success: true, message: result.message };
      } else {
        setError(result.error || "Failed to log out all other sessions");
        return { success: false, error: result.error };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to log out all other sessions";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return {
    profileForm,
    accountForm,
    loading,
    fetching,
    userProfile,
    error,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    deleteSession,
    deleteAllOtherSessions,
  };
}

export default useProfile;

