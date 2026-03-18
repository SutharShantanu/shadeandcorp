"use client";

import { useState, useEffect, useCallback } from "react";

export interface Address {
  _id?: string;
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

/**
 * Shared hook for address CRUD operations.
 * Used in both the profile AddressesTab and the QuickCheckoutModal.
 *
 * @param autoFetch - When true (default), fetches addresses on mount.
 *                    Pass false and call fetchAddresses() manually (e.g., when a modal opens).
 */
export function useAddresses(autoFetch = true) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(autoFetch);

  const fetchAddresses = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/user/profile/addresses");
      const data = await res.json();
      if (data.ok && data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error("useAddresses: fetch failed", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchAddresses();
  }, [autoFetch, fetchAddresses]);

  /** Add a new address. Re-fetches the list to get the real MongoDB _id. */
  async function addAddress(data: Omit<Address, "_id">) {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.ok) {
        await fetchAddresses();
        return { success: true as const, message: result.message as string };
      }
      return { success: false as const, error: result.error as string };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add address";
      return { success: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }

  /** Update fields on an existing address by its _id. */
  async function updateAddress(addressId: string, data: Partial<Address>) {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile/addresses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId, ...data }),
      });
      const result = await res.json();
      if (result.ok) {
        await fetchAddresses();
        return { success: true as const, message: result.message as string };
      }
      return { success: false as const, error: result.error as string };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update address";
      return { success: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }

  /** Remove an address by its _id (optimistic + re-fetch on failure). */
  async function deleteAddress(addressId: string) {
    // Optimistic update
    setAddresses((prev) => prev.filter((a) => a._id?.toString() !== addressId));
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user/profile/addresses?addressId=${addressId}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.ok) {
        return { success: true as const, message: result.message as string };
      }
      // Roll back on failure
      await fetchAddresses();
      return { success: false as const, error: result.error as string };
    } catch (err) {
      await fetchAddresses();
      const msg = err instanceof Error ? err.message : "Failed to delete address";
      return { success: false as const, error: msg };
    } finally {
      setLoading(false);
    }
  }

  /** Shorthand for marking an address as the default. */
  async function setDefaultAddress(addressId: string) {
    return updateAddress(addressId, { isDefault: true });
  }

  const defaultAddress = addresses.find((a) => a.isDefault);

  return {
    addresses,
    defaultAddress,
    loading,
    fetching,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
