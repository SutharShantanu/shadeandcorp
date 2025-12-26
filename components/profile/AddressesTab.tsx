"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Home, BriefcaseBusiness, MapPinHouse } from "lucide-react";
import { IconBadge } from "../ui/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type AddressFormData } from "@/lib/validations/address";
import { AddressDialog } from "./AddressDialog";

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

  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (shouldOpenModal) {
      setIsAddDialogOpen(true);
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [shouldOpenModal, onModalClose]);

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
  };

  const handleDeleteAddress = () => {
    if (!selectedAddress) return;

    const newAddresses = addresses.filter((addr) => addr.id !== selectedAddress.id);

    if (selectedAddress.isDefault && newAddresses.length > 0) {
      newAddresses[0].isDefault = true;
    }

    setAddresses(newAddresses);
    toast.success("Address deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedAddress(null);
  };

  const openAddDialog = () => {
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
                    <IconBadge
                      variant={address.addressType === "home" ? "info" : address.addressType === "work" ? "warning" : "success"}
                      size="sm"
                    >
                      {address.addressType === "home" ? (
                        <Home className="size-3" />
                      ) : address.addressType === "work" ? (
                        <BriefcaseBusiness className="size-3" />
                      ) : (
                        <MapPinHouse className="size-3" />
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

      <AddressDialog
        open={isAddDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsAddDialogOpen(open);
          if (!open && searchParams?.has("action")) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("action");
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
          }
        }}
        onSubmit={handleAddAddress}
        title="Add New Address"
        description="Add a new shipping address for faster checkout"
        submitLabel="Add Address"
      />

      <AddressDialog
        open={isEditDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedAddress(null);
        }}
        onSubmit={handleEditAddress}
        initialData={selectedAddress || undefined}
        title="Edit Address"
        description="Update your shipping address details"
        submitLabel="Save Changes"
      />

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

