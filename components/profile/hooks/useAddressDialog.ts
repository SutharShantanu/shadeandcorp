import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Country, State } from "country-state-city";
import { addressSchema, type AddressFormData } from "@/lib/validations/address";

const DEFAULT_FORM_VALUES: AddressFormData = {
  address1: "",
  address2: "",
  landmark: "",
  city: "",
  state: "",
  zipCode: "",
  country: "IN",
  addressType: undefined as any,
  isDefault: false,
};

export function useAddressDialog(
  open: boolean,
  initialData?: Partial<AddressFormData>
) {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Memoize default values to maintain reference stability
  const defaultValues = useMemo(
    () => ({
      ...DEFAULT_FORM_VALUES,
      ...initialData,
    }),
    [initialData],
  );

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  // Reset form whenever dialog opens with new data
  useEffect(() => {
    if (open) {
      form.reset(defaultValues);
    }
  }, [open, defaultValues, form]);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    const toastId = toast.loading("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "User-Agent": "ShadeAndCo/1.0" } },
          );

          if (!response.ok) throw new Error();

          const { address } = await response.json();
          const countryCode = address.country_code?.toUpperCase();
          const country = Country.getAllCountries().find(
            (c) => c.isoCode === countryCode,
          );
          const states = countryCode
            ? State.getStatesOfCountry(countryCode)
            : [];
          const stateName =
            address.state ||
            address.province ||
            address.region ||
            address.state_district;

          const state =
            states.find(
              (s) => s.name.toLowerCase() === stateName?.toLowerCase(),
            ) ||
            states.find(
              (s) =>
                stateName &&
                (s.name.toLowerCase().includes(stateName.toLowerCase()) ||
                  stateName.toLowerCase().includes(s.name.toLowerCase())),
            );

          const detectedData = {
            address1: [address.house_number, address.road || address.street]
              .filter(Boolean)
              .join(" "),
            address2: address.suburb || address.neighbourhood || "",
            landmark: address.landmark || "",
            city: address.city || address.town || address.village || "",
            state: state?.isoCode || "",
            zipCode: address.postcode || "",
            country: country?.isoCode || "IN",
          };

          // Update form fields individually to keep validation state accurate
          Object.entries(detectedData).forEach(([key, value]) => {
            form.setValue(key as any, value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          });

          toast.success("Location detected successfully!", { id: toastId });
        } catch (error) {
          toast.error(
            "Failed to detect location details. Please enter manually.",
            { id: toastId },
          );
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        const errorMap: Record<number, string> = {
          1: "Location permission denied. Please allow location access.",
          2: "Location information unavailable.",
          3: "Location request timed out.",
        };
        toast.error(errorMap[error.code] || "Failed to detect location", {
          id: toastId,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return {
    form,
    isDetectingLocation,
    detectLocation,
  };
}
