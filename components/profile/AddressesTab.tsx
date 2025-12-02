"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2, Check, Navigation } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountrySelect, StateSelect, CitySelect } from "@/components/ui/country-state-select";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { useRouter } from "next/navigation";
import { Country, State } from "country-state-city";
interface AddressesTabProps {
  userProfile: UserProfile | null;
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}

interface Address {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: "home" | "work" | "other";
  isDefault: boolean;
}

export default function AddressesTab({ userProfile, shouldOpenModal, onModalClose }: AddressesTabProps) {
  const router = useRouter();

  // Convert userProfile addresses to Address format
  const [addresses, setAddresses] = useState<Address[]>(
    (userProfile?.addresses || []).map((addr: any, index: number) => ({
      id: addr._id || `addr-${index}`,
      address1: addr.address1 || "",
      address2: addr.address2,
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
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    addressType: "home",
    isDefault: false,
  });

  // Auto-open modal when shouldOpenModal is true
  useEffect(() => {
    if (shouldOpenModal) {
      openAddDialog();
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [shouldOpenModal, onModalClose]);

  useEffect(() => {
    if (selectedAddress && isEditDialogOpen) {
      setFormData({
        address1: selectedAddress.address1,
        address2: selectedAddress.address2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country,
        addressType: selectedAddress.addressType,
        isDefault: selectedAddress.isDefault,
      });
    }
  }, [selectedAddress, isEditDialogOpen]);

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

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      ...formData,
      isDefault: addresses.length === 0 ? true : formData.isDefault,
    };

    setAddresses(
      formData.isDefault
        ? [...addresses.map(addr => ({ ...addr, isDefault: false })), newAddress]
        : [...addresses, newAddress]
    );

    toast.success("Address added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditAddress = () => {
    if (!selectedAddress) return;

    setAddresses(
      addresses.map((addr) =>
        addr.id === selectedAddress.id
          ? { ...addr, ...formData }
          : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
      )
    );

    toast.success("Address updated successfully");
    setIsEditDialogOpen(false);
    setSelectedAddress(null);
    resetForm();
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

  const resetForm = () => {
    setFormData({
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      addressType: "home",
      isDefault: false,
    });
  };

  const openAddDialog = () => {
    resetForm();
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

          setFormData({
            ...formData,
            address1: addressLine1,
            address2: addressLine2,
            city: city,
            state: state?.isoCode || "",
            zipCode: postcode,
            country: country?.isoCode || "IN",
          });

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
          <Plus className="h-4 w-4 mr-2" />
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
                    <MapPin className="size-4" />
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
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Set as Default
                      </Button>
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
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl px-6 py-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-0 pb-4">
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Add a new shipping address for faster checkout
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Auto-detect Location Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
              >
                <Navigation className={`h-4 w-4 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
                {isDetectingLocation ? "Detecting Location..." : "Auto-detect My Location"}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">Country *</Label>
                <CountrySelect
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value, state: "", city: "" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <StateSelect
                  countryCode={formData.country}
                  value={formData.state}
                  onChange={(value) => setFormData({ ...formData, state: value, city: "" })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <CitySelect
                  countryCode={formData.country}
                  stateCode={formData.state}
                  value={formData.city}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="ZIP Code"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addressType">Address Type *</Label>
              <Select
                value={formData.addressType}
                onValueChange={(value: "home" | "work" | "other") =>
                  setFormData({ ...formData, addressType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAddress}
              disabled={!formData.address1 || !formData.city || !formData.state || !formData.zipCode || !formData.country}
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
          <div className="grid gap-4 py-4">
            {/* Auto-detect Location Button */}
            <div className="flex justify-center pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="w-full sm:w-auto"
              >
                <Navigation className={`h-4 w-4 mr-2 ${isDetectingLocation ? 'animate-pulse' : ''}`} />
                {isDetectingLocation ? "Detecting Location..." : "Auto-detect My Location"}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-address1">Address Line 1 *</Label>
              <Input
                id="edit-address1"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address2">Address Line 2</Label>
              <Input
                id="edit-address2"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-country">Country *</Label>
                <CountrySelect
                  value={formData.country}
                  onChange={(value) => setFormData({ ...formData, country: value, state: "", city: "" })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-state">State *</Label>
                <StateSelect
                  countryCode={formData.country}
                  value={formData.state}
                  onChange={(value) => setFormData({ ...formData, state: value, city: "" })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City *</Label>
                <CitySelect
                  countryCode={formData.country}
                  stateCode={formData.state}
                  value={formData.city}
                  onChange={(value) => setFormData({ ...formData, city: value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-zipCode">ZIP Code *</Label>
                <Input
                  id="edit-zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="ZIP Code"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-addressType">Address Type *</Label>
              <Select
                value={formData.addressType}
                onValueChange={(value: "home" | "work" | "other") =>
                  setFormData({ ...formData, addressType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditAddress}
              disabled={!formData.address1 || !formData.city || !formData.state || !formData.zipCode || !formData.country}
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

