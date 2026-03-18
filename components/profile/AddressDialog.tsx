"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Navigation,
  Home,
  BriefcaseBusiness,
  MapPinHouse,
  CircleCheck,
  Loader2,
} from "lucide-react";
import { IconBadge } from "../ui/icon-badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "@/components/ui/country-state-select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Country, State } from "country-state-city";
import { addressSchema, type AddressFormData } from "@/lib/validations/address";
import { cn } from "@/lib/utils";

// Constants for shared configuration
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

export const ADDRESS_TYPES = [
  { value: "home", label: "Home", icon: Home, variant: "info" as const },
  {
    value: "work",
    label: "Work",
    icon: BriefcaseBusiness,
    variant: "warning" as const,
  },
  {
    value: "other",
    label: "Other",
    icon: MapPinHouse,
    variant: "success" as const,
  },
];

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  title: string;
  description: string;
  submitLabel: string;
}

export function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  description,
  submitLabel,
}: AddressDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="address-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-h-[70vh] overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Address Information
                  </h4>
                </div>

                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                          Address Line 1 *
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Street name and number"
                              className="h-10 bg-muted/20"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={detectLocation}
                              disabled={isDetectingLocation}
                              className="h-full px-3 border border-dashed border-primary transition-all"
                            >
                              {isDetectingLocation ? (
                                <Loader2 className="size-4 animate-spin text-primary" />
                              ) : (
                                <Navigation className="size-4 text-primary fill-primary" />
                              )}
                              <span className="text-xs font-medium">
                                {isDetectingLocation
                                  ? "Detecting..."
                                  : "Detect Location"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "address2",
                        label: "Address Line 2 (Optional)",
                        placeholder: "Apt, Suite, Floor",
                      },
                      {
                        name: "landmark",
                        label: "Landmark (Optional)",
                        placeholder: "E.g. Near City Mall",
                      },
                    ].map((f) => (
                      <FormField
                        key={f.name}
                        control={form.control}
                        name={f.name as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                              {f.label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={f.placeholder}
                                className="h-10 bg-muted/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            Country *
                          </FormLabel>
                          <FormControl>
                            <CountrySelect
                              value={field.value}
                              className="h-10 bg-muted/20"
                              onChange={(val: string) => {
                                field.onChange(val);
                                form.setValue("state", "");
                                form.setValue("city", "");
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            State *
                          </FormLabel>
                          <FormControl>
                            <StateSelect
                              countryCode={form.watch("country") || ""}
                              value={field.value}
                              className="h-10 bg-muted/20"
                              onChange={(val: string) => {
                                field.onChange(val);
                                form.setValue("city", "");
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            City *
                          </FormLabel>
                          <FormControl>
                            <CitySelect
                              countryCode={form.watch("country") || ""}
                              stateCode={form.watch("state") || ""}
                              value={field.value}
                              className="h-10 bg-muted/20"
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                            ZIP Code *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ZIP"
                              className="h-10 bg-muted/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </section>

              <Separator />

              <section className="space-y-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Preferences
                  </h4>
                </div>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="addressType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-xs font-bold uppercase text-muted-foreground">
                          Address Type
                        </FormLabel>
                        <FormControl>
                          <RadioGroupPrimitive.Root
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-wrap gap-2"
                          >
                            {ADDRESS_TYPES.map((option) => (
                              <RadioGroupPrimitive.Item
                                key={option.value}
                                value={option.value}
                                className={cn(
                                  "group relative flex items-center gap-2 p-1 pr-2 rounded-full border-2 transition-all ease-in-out outline-none bg-secondary text-secondary-foreground hover:bg-secondary/80",
                                  "data-[state=checked]:border-primary data-[state=checked]:bg-primary overflow-hidden border-transparent",
                                )}
                              >
                                <IconBadge variant={option.variant} size="sm">
                                  <option.icon className="size-3 transition-all ease-in-out" />
                                </IconBadge>
                                <span className="text-xs font-bold tracking-wide group-data-[state=checked]:text-primary-foreground">
                                  {option.label}
                                </span>
                                <CircleCheck className="size-5 text-primary fill-background transition-all duration-200 ease-in-out -mr-8 translate-x-1 opacity-0 shrink-0 group-data-[state=checked]:mr-0 group-data-[state=checked]:translate-x-0 group-data-[state=checked]:opacity-100" />
                              </RadioGroupPrimitive.Item>
                            ))}
                          </RadioGroupPrimitive.Root>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Field
                            orientation="horizontal"
                            className={cn(
                              "flex items-center justify-between p-4 rounded-xl border-2 transition-all ease-in-out",
                              field.value
                                ? "border-primary bg-primary/5"
                                : "border-transparent bg-muted/30 hover:bg-muted/50",
                            )}
                          >
                            <FieldLabel
                              htmlFor="is-default-address"
                              className="flex items-center gap-3 cursor-pointer font-normal m-0 p-0 flex-1"
                            >
                              <div
                                className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-colors",
                                  field.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background text-muted-foreground",
                                )}
                              >
                                <CircleCheck className="size-5 shrink-0" />
                              </div>
                              <div className="text-left">
                                <div
                                  className={cn(
                                    "text-sm font-bold",
                                    field.value
                                      ? "text-primary"
                                      : "text-foreground",
                                  )}
                                >
                                  Set as default address
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-tight">
                                  Use this for automatically selected shipping
                                </p>
                              </div>
                            </FieldLabel>
                            <Checkbox
                              id="is-default-address"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="size-5 rounded-md border-2 border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary shrink-0"
                            />
                          </Field>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </div>
          </form>
        </Form>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border gap-2">
          <Button
            variant="outline"
            className=""
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="address-form"
            className=""
            disabled={!form.formState.isValid}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
