"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Check, Navigation, Home, Briefcase, Landmark, CircleCheck, Loader2, MapPinHouse, BriefcaseBusiness } from "lucide-react";
import { IconBadge } from "../ui/icon-badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CountrySelect, StateSelect, CitySelect } from "@/components/ui/country-state-select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Country, State } from "country-state-city";
import { addressSchema, type AddressFormData } from "@/lib/validations/address";
import { cn } from "@/lib/utils";
interface AddressesTabProps {
  userProfile: UserProfile | null;
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}

interface Address {
  id: string;
  address1: string;
  address2?: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: "home" | "work" | "other";
  isDefault: boolean;
}

export default function AddressesTab({ userProfile, shouldOpenModal, onModalClose }: AddressesTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Convert userProfile addresses to Address format
  const [addresses, setAddresses] = useState<Address[]>(
    (userProfile?.addresses || []).map((addr: Address, index: number) => ({
      id: addr.id || `addr-${index}`,
      address1: addr.address1 || "",
      address2: addr.address2,
      landmark: addr.landmark,
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      country: addr.country || "India",
      addressType: (addr.addressType || "home") as "home" | "work" | "other",
      isDefault: addr.isDefault || false,
    }))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Form for adding address
  const addForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address1: "",
      address2: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    },
  });

  // Form for editing address
  const editForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address1: "",
      address2: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    },
  });

  // Auto-open when URL contains action=add
  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      addForm.reset({
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        addressType: "home",
        isDefault: false,
      });
      setIsAddDialogOpen(true);
    }
  }, [searchParams, addForm]);

  // Auto-open modal when shouldOpenModal is true
  useEffect(() => {
    if (shouldOpenModal) {
      addForm.reset({
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        addressType: "home",
        isDefault: false,
      });
      setIsAddDialogOpen(true);
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [shouldOpenModal, onModalClose, addForm]);

  useEffect(() => {
    if (selectedAddress && isEditDialogOpen) {
      editForm.reset({
        address1: selectedAddress.address1,
        address2: selectedAddress.address2,
        landmark: selectedAddress.landmark,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country,
        addressType: selectedAddress.addressType,
        isDefault: selectedAddress.isDefault,
      });
    }
  }, [selectedAddress, isEditDialogOpen, editForm]);

  const formatAddressType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success("Default address updated");
  };

  const handleAddAddress = (data: AddressFormData) => {
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      ...data,
      isDefault: addresses.length === 0 ? true : data.isDefault,
    };

    setAddresses(
      data.isDefault
        ? [...addresses.map(addr => ({ ...addr, isDefault: false })), newAddress]
        : [...addresses, newAddress]
    );

    toast.success("Address added successfully");
    setIsAddDialogOpen(false);
    addForm.reset();

    // Remove action=add from URL
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("action");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleEditAddress = (data: AddressFormData) => {
    if (!selectedAddress) return;

    setAddresses(
      addresses.map((addr) =>
        addr.id === selectedAddress.id
          ? { ...addr, ...data }
          : data.isDefault
            ? { ...addr, isDefault: false }
            : addr
      )
    );

    toast.success("Address updated successfully");
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
    editForm.reset();
  };

  const handleDeleteAddress = () => {
    if (!selectedAddress) return;

    const newAddresses = addresses.filter((addr) => addr.id !== selectedAddress.id);

    // If deleted address was default, set first remaining address as default
    if (selectedAddress.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }

    setAddresses(newAddresses);
    toast.success("Address deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedAddress(null);
  };

  const openAddDialog = () => {
    addForm.reset({
      address1: "",
      address2: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setSelectedAddress(address);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (address: Address) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const detectLocation = async (form: any) => {
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
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'ShadeAndCo/1.0'
              }
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }

          const data = await response.json();
          const address = data.address;

          console.log("Location API Response:", data); // Debug log

          // Find country by ISO code
          const countryCode = address.country_code?.toUpperCase();
          const country = Country.getAllCountries().find(
            c => c.isoCode === countryCode
          );

          // Find state by name - try multiple possible fields
          const stateName = address.state || address.province || address.region || address.state_district;
          const states = countryCode ? State.getStatesOfCountry(countryCode) : [];

          // Try exact match first, then partial match
          let state = states.find(
            s => s.name.toLowerCase() === stateName?.toLowerCase()
          );

          // If no exact match, try finding by partial match
          if (!state && stateName) {
            state = states.find(
              s => s.name.toLowerCase().includes(stateName.toLowerCase()) ||
                stateName.toLowerCase().includes(s.name.toLowerCase())
            );
          }

          console.log("Detected State:", stateName, "Mapped to:", state?.name); // Debug log

          // Extract address components
          const street = address.road || address.street || "";
          const houseNumber = address.house_number || "";
          const suburb = address.suburb || address.neighbourhood || "";
          const city = address.city || address.town || address.village || "";
          const postcode = address.postcode || "";

          // Build address line 1
          const addressLine1 = [houseNumber, street].filter(Boolean).join(" ");
          const addressLine2 = suburb;

          form.setValue("address1", addressLine1);
          form.setValue("address2", addressLine2);
          form.setValue("landmark", address.landmark || "");
          form.setValue("city", city);
          form.setValue("state", state?.isoCode || "");
          form.setValue("zipCode", postcode);
          form.setValue("country", country?.isoCode || "IN");

          toast.success("Location detected successfully!", { id: toastId });
        } catch (error) {
          console.error("Error fetching location details:", error);
          toast.error("Failed to detect location details. Please enter manually.", { id: toastId });
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let errorMessage = "Failed to detect location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast.error(errorMessage, { id: toastId });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Addresses</h3>
          <p className="text-sm text-muted-foreground">
            Manage your shipping addresses for faster checkout.
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {addresses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconBadge variant="default" size="sm">
                      {address.addressType === "home" ? (
                        <Home className="size-3 text-muted-foreground" />
                      ) : address.addressType === "work" ? (
                        <Briefcase className="size-3 text-muted-foreground" />
                      ) : (
                        <Landmark className="size-3 text-muted-foreground" />
                      )}
                    </IconBadge>
                    {formatAddressType(address.addressType)}
                  </CardTitle>
                  {address.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">{address.address1}</p>
                    {address.address2 && (
                      <p className="text-muted-foreground">{address.address2}</p>
                    )}
                    {address.landmark && (
                      <p className="text-muted-foreground">Landmark: {address.landmark}</p>
                    )}
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {!address.isDefault && (
                      <div className="flex items-center space-x-2 border rounded-md px-3 py-1.5 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Checkbox id={`default-${address.id}`} checked={false} />
                        <Label htmlFor={`default-${address.id}`} className="text-sm font-medium cursor-pointer">
                          Set as Default
                        </Label>
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(address)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(address)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open && searchParams) {
            const params = new URLSearchParams(searchParams.toString());
            if (params.has("action")) {
              params.delete("action");
              const query = params.toString();
              router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Add New Address</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new shipping address for faster checkout
            </DialogDescription>
          </DialogHeader>

          <Form {...addForm}>
            <form id="add-address-form" onSubmit={addForm.handleSubmit((data) => handleAddAddress(data))} className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Section: Address Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Address Information</h4>
                  </div>

                  <div className="grid gap-4">
                    <FormField
                      control={addForm.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Address Line 1 *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="Street name and number" className="h-10 bg-muted/20" {...field} />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => detectLocation(addForm)}
                                disabled={isDetectingLocation}
                                className="h-full px-3 border-dashed w-fit hover:border-primary/50 hover:bg-primary/5 transition-all"
                              >
                                {isDetectingLocation ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                  <Navigation className="h-4 w-4 text-primary" />
                                )}
                                <span className="text-xs font-medium">
                                  {isDetectingLocation ? "Detecting..." : "Detect Location"}
                                </span>
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="address2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Address Line 2 (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Apt, Suite, Floor" className="h-10 bg-muted/20" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="landmark"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Landmark (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="E.g. Near City Mall" className="h-10 bg-muted/20" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Country *</FormLabel>
                            <FormControl>
                              <CountrySelect
                                value={field.value}
                                className="h-10 bg-muted/20"
                                onChange={(value) => {
                                  field.onChange(value);
                                  addForm.setValue("state", "");
                                  addForm.setValue("city", "");
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">State *</FormLabel>
                            <FormControl>
                              <StateSelect
                                countryCode={addForm.watch("country") || ""}
                                value={field.value}
                                className="h-10 bg-muted/20"
                                onChange={(value) => {
                                  field.onChange(value);
                                  addForm.setValue("city", "");
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
                        control={addForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">City *</FormLabel>
                            <FormControl>
                              <CitySelect
                                countryCode={addForm.watch("country") || ""}
                                stateCode={addForm.watch("state") || ""}
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
                        control={addForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase text-muted-foreground">ZIP Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter ZIP" className="h-10 bg-muted/20" {...field} />
                            </FormControl>
                            <FormMessage className="text-[10px]" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section: Preferences */}
                <div className="space-y-4 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">Preferences</h4>
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={addForm.control}
                      name="addressType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Address Type</FormLabel>
                          <FormControl>
                            <RadioGroupPrimitive.Root
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2"
                            >
                              {[
                                { value: "home", label: "Home", icon: Home, variant: "info" as const },
                                { value: "work", label: "Work", icon: BriefcaseBusiness, variant: "warning" as const },
                                { value: "other", label: "Other", icon: MapPinHouse, variant: "success" as const }
                              ].map((option) => (
                                <RadioGroupPrimitive.Item
                                  key={option.value}
                                  value={option.value}
                                  className={cn(
                                    "group relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all outline-none",
                                    "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 border-transparent bg-muted/30 hover:bg-muted/50"
                                  )}
                                >
                                  <IconBadge
                                    variant={option.variant}
                                    size="sm"
                                    className="transition-transform duration-200 group-data-[state=checked]:scale-110"
                                  >
                                    <option.icon />
                                  </IconBadge>
                                  <span className="text-sm font-bold tracking-wide">{option.label}</span>

                                  {field.value === option.value && (
                                    <div className="flex items-center ml-1">
                                      <CircleCheck className="size-5 text-primary fill-background shrink-0" />
                                    </div>
                                  )}
                                </RadioGroupPrimitive.Item>
                              ))}
                            </RadioGroupPrimitive.Root>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <label
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                                field.value ? "border-primary bg-primary/5" : "border-transparent bg-muted/30 hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-colors",
                                  field.value ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                                )}>
                                  <CircleCheck className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className={cn("text-sm font-bold", field.value ? "text-primary" : "text-foreground")}>
                                    Set as default address
                                  </div>
                                  <p className="text-[11px] text-muted-foreground leading-tight">Use this for automatically selected shipping</p>
                                </div>
                              </div>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="h-5 w-5 rounded-md border-2 border-muted-foreground/30 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                              />
                            </label>
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>

          <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="px-6 h-10 rounded-full font-semibold border-border hover:bg-accent transition-all"
              onClick={() => {
                setIsAddDialogOpen(false);
                const params = new URLSearchParams(searchParams?.toString() || "");
                params.delete("action");
                const query = params.toString();
                router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-address-form"
              className="px-8 h-10 rounded-full font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              disabled={!addForm.formState.isValid}
            >
              Add Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your shipping address details
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form id="edit-address-form" onSubmit={editForm.handleSubmit((data) => handleEditAddress(data))} className="space-y-4 py-4">
              {/* Auto-detect Location Button */}
              <div className="flex justify-center pb-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => detectLocation(editForm)}
                  disabled={isDetectingLocation}
                  className="w-full sm:w-auto"
                >
                  {isDetectingLocation ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4 mr-2" />
                  )}
                  {isDetectingLocation ? "Finding your location…" : "Get My Location"}
                </Button>
              </div>

              <FormField
                control={editForm.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1 *</FormLabel>
                    <FormControl>
                      <Input placeholder="Street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="address2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Apartment, suite, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="landmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Landmark (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Near Central Park" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <CountrySelect
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            editForm.setValue("state", "");
                            editForm.setValue("city", "");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <FormControl>
                        <StateSelect
                          countryCode={editForm.watch("country") || ""}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            editForm.setValue("city", "");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <CitySelect
                          countryCode={editForm.watch("country") || ""}
                          stateCode={editForm.watch("state") || ""}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="addressType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Address Type</FormLabel>
                    <FormControl>
                      <RadioGroupPrimitive.Root
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-2"
                      >
                        {[
                          { value: "home", label: "Home", icon: Home, variant: "info" as const },
                          { value: "work", label: "Work", icon: BriefcaseBusiness, variant: "warning" as const },
                          { value: "other", label: "Other", icon: MapPinHouse, variant: "success" as const }
                        ].map((option) => (
                          <RadioGroupPrimitive.Item
                            key={option.value}
                            value={option.value}
                            className={cn(
                              "group relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all outline-none",
                              "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 border-transparent bg-muted/30 hover:bg-muted/50"
                            )}
                          >
                            <IconBadge
                              variant={option.variant}
                              size="sm"
                              className="transition-transform duration-200 group-data-[state=checked]:scale-110"
                            >
                              <option.icon />
                            </IconBadge>
                            <span className="text-sm font-bold tracking-wide">{option.label}</span>

                            {field.value === option.value && (
                              <div className="flex items-center ml-1">
                                <CircleCheck className="size-5 text-primary fill-background shrink-0" />
                              </div>
                            )}
                          </RadioGroupPrimitive.Item>
                        ))}
                      </RadioGroupPrimitive.Root>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-base font-medium">Default Address</FormLabel>
                    <FormControl>
                      <div
                        onClick={() => field.onChange(!field.value)}
                        className={`border p-4 rounded-lg cursor-pointer shadow-sm transition-all ${field.value ? "border-primary bg-primary/5" : "border-border bg-muted/40"}`}
                        aria-pressed={field.value}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg ${field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            <CircleCheck className="h-5 w-5" />
                          </span>
                          <div className="space-y-1 flex-1">
                            <div className={`text-sm font-semibold ${field.value ? "text-primary" : "text-foreground"}`}>Set as default address</div>
                            <p className="text-xs text-muted-foreground">Use this as your primary shipping option for faster checkout</p>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-address-form"
              disabled={!editForm.formState.isValid}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
              {selectedAddress?.isDefault && addresses.length > 1 && (
                <span className="block mt-2 text-amber-600 dark:text-amber-500">
                  Note: The first remaining address will be set as your new default.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAddress} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

