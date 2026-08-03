import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAddresses, type Address } from "@/hook/useAddresses";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type AddressFormData } from "@/lib/validations/address";

interface UseAddressesTabProps {
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}

export function useAddressesTab({ shouldOpenModal, onModalClose }: UseAddressesTabProps) {
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

  return {
    addresses,
    loading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedAddress,
    alertDismissed,
    setAlertDismissed,
    formatAddressType,
    handleSetDefault,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    openEditDialog,
    openDeleteDialog,
    setSelectedAddress,
  };
}
