import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import useIPStackLocation from "@/hook/useIPStackLocation";
import { parsePhoneNumber } from "react-phone-number-input";
import { tabSchemas } from "../enums/profile.enums";
import { fullSchema } from "../schema/edit-profile.schema";
import {
  AccountStatusEnum,
  DefaultValues,
} from "@/app/models/enums/users.enum";

export const useEditProfile = (profileData, userId, activeTabValue) => {
  const [loading, setLoading] = useState(false);
  const { locationData } = useIPStackLocation();
  const detectedCountryCode = locationData?.country_code;
  const detectedCountryName = locationData?.country_name;

  const [error, setError] = useState(null);
  const activeSchema = tabSchemas[activeTabValue] || fullSchema;

  const form = useForm({
    resolver: zodResolver(activeSchema),
    mode: "onChange",
    // reValidateMode: "onChange",
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
      country: DefaultValues.COUNTRY,
      accountStatus: AccountStatusEnum.ACTIVE,
      newPassword: "",
      confirmPassword: "",
      ...profileData,
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone:
          profileData.phone && profileData.countryCode ?
            `+${profileData.countryCode}${profileData.phone}`
          : "",
        gender: profileData.gender || "",
        birthday: profileData.birthday && new Date(profileData.birthday),
        address1: profileData.address1 || "",
        address2: profileData.address2 || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipCode || "",
        country: profileData.country || "India",
        accountStatus: profileData.accountStatus || "active",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [form, profileData]);

  useEffect(() => {
    console.log("Current tab:", activeTabValue);
    if (activeSchema?._def?.shape) {
      console.log("Schema fields:", Object.keys(activeSchema._def.shape));
    } else {
      console.warn("No shape found on schema.");
    }
  }, [activeTabValue, activeSchema]);


  const onSubmit = async (values) => {
    setLoading(true);
    setError(null);

    const { confirmPassword, newPassword, phone, country, ...restPayload } =
      values;

    console.log("phone", phone);
    let parsedPhoneNumber;
    try {
      parsedPhoneNumber = parsePhoneNumber(phone);
    } catch (error) {
      console.error("Error parsing phone number:", error);
      toast.error("Invalid phone number format");
      setLoading(false);
      return;
    }

    const userProvidedCountryCode =
      parsedPhoneNumber?.countryCallingCode || detectedCountryCode;
    const nationalNumber = parsedPhoneNumber?.nationalNumber;

    // Final payload to API
    const finalPayload = {
      ...restPayload,
      phone: nationalNumber,
      country, // user's selected country, not from IP
      countryCode: userProvidedCountryCode,
      ...(newPassword && { newPassword }),
    };

    try {
      const response = await axios.put(
        `/api/users/profile?id=${userId}`,
        finalPayload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!");
      } else if (response.data?.error) {
        toast.error(response.data.error);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      const apiError = err.response?.data?.error || err.response?.data?.message;
      setError(apiError || "Failed to update profile.");
      toast.error(apiError || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    error,
    countryCode: detectedCountryCode,
    countryName: detectedCountryName,
  };
};
