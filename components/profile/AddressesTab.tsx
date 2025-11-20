"use client";

import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface AddressesTabProps {
  userProfile: UserProfile | null;
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

export default function AddressesTab({ userProfile }: AddressesTabProps) {
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
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
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
        <Button>
          <Plus className="size-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No addresses saved yet</p>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                        <Check className="size-4 mr-2" />
                        Set as Default
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="size-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

