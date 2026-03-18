"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  BriefcaseBusiness,
  MapPinHouse,
  X,
  Loader2,
} from "lucide-react";
import { IconBadge } from "../ui/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { useAddresses, type Address } from "@/hook/useAddresses";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type AddressFormData } from "@/lib/validations/address";
import { AddressDialog } from "./AddressDialog";
import { Alert, AlertDescription } from "../ui/alert";

interface AddressesTabProps {
  userProfile: UserProfile | null;
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}


export default function AddressesTab({
  shouldOpenModal,
  onModalClose,
}: AddressesTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { addresses: rawAddresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useAddresses();

  // Map raw MongoDB docs to local Address shape (stable _id → id)
  const addresses = rawAddresses.map((addr, i) => ({
    ...addr,
    id: addr._id?.toString() || `addr-${i}`,
  }));

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      setIsAddDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (shouldOpenModal) {
      setIsAddDialogOpen(true);
      if (onModalClose) onModalClose();
    }
  }, [shouldOpenModal, onModalClose]);

  const formatAddressType = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1);

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id);
    if (result?.success) {
      toast.success("Default address updated");
    } else {
      toast.error(result?.error || "Failed to update default address");
    }
  };

  const handleAddAddress = async (data: AddressFormData) => {
    const result = await addAddress(data as any);
    if (result?.success) {
      toast.success("Address added successfully");
      setIsAddDialogOpen(false);
      // Clean up URL action param
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("action");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    } else {
      toast.error(result?.error || "Failed to add address");
    }
  };

  const handleEditAddress = async (data: AddressFormData) => {
    if (!selectedAddress) return;
    const result = await updateAddress(selectedAddress._id!, data as any);
    if (result?.success) {
      toast.success("Address updated successfully");
      setIsEditDialogOpen(false);
      setSelectedAddress(null);
    } else {
      toast.error(result?.error || "Failed to update address");
    }
  };

  const handleDeleteAddress = async () => {
    if (!selectedAddress) return;
    const result = await deleteAddress(selectedAddress._id!);
    if (result?.success) {
      toast.success("Address deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedAddress(null);
    } else {
      toast.error(result?.error || "Failed to delete address");
    }
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
        <Button
          variant="outline"
          onClick={() => setIsAddDialogOpen(true)}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 && !alertDismissed && (
        <Alert color="info">
          <MapPinHouse className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium mb-1">No addresses added yet</p>
              <p className="text-xs">
                Add a shipping address for faster, secure checkout
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setAlertDismissed(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {addresses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={address.isDefault ? "border-primary" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <IconBadge
                      variant={
                        address.addressType === "home"
                          ? "info"
                          : address.addressType === "work"
                            ? "warning"
                            : "success"
                      }
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
                      <p className="text-muted-foreground">
                        Landmark: {address.landmark}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-muted-foreground">{address.country}</p>
                  </div>
                  <div className="flex gap-2 pt-2 flex-wrap">
                    {!address.isDefault && (
                      <div
                        className="flex items-center space-x-2 border rounded-md px-3 py-1.5 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => !loading && handleSetDefault(address.id)}
                      >
                        <Checkbox
                          id={`default-${address.id}`}
                          checked={false}
                          disabled={loading}
                        />
                        <Label
                          htmlFor={`default-${address.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          Set as Default
                        </Label>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(address)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(address)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
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
            router.replace(query ? `${pathname}?${query}` : pathname, {
              scroll: false,
            });
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
              {selectedAddress?.isDefault && addresses.length > 1 && (
                <span className="block mt-2 text-amber-600 dark:text-amber-500">
                  Note: The first remaining address will be set as your new
                  default.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAddress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin mr-1" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
