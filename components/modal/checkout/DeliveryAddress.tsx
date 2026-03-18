import { useState } from "react";
import {
  MapPin,
  Plus,
  Home,
  BriefcaseBusiness,
  MapPinHouse,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/ui/icon-badge";
import { CheckoutAddressForm } from "@/components/modal/checkout/CheckoutAddressForm";
import { AddressFormData } from "@/lib/validations/address";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

interface Address {
  _id?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

interface DeliveryAddressProps {
  addresses: Address[];
  selectedAddress: string;
  onAddressChange: (addressId: string) => void;
  onAddAddress?: (data: AddressFormData) => void;
}

const ADDRESS_TYPE_CONFIG = {
  home: { icon: Home, variant: "info" as const },
  work: { icon: BriefcaseBusiness, variant: "warning" as const },
  other: { icon: MapPinHouse, variant: "success" as const },
};

export function DeliveryAddress({
  addresses,
  selectedAddress,
  onAddressChange,
  onAddAddress,
}: DeliveryAddressProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddAddress = (data: AddressFormData) => {
    if (onAddAddress) {
      onAddAddress(data);
    }
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <CheckoutAddressForm
        onSubmit={handleAddAddress}
        onCancel={() => setIsAdding(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-foreground">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          Shipping Address
        </h3>
        {addresses.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="text-xs"
          >
            <Plus className="size-3.5" /> Add New Address
          </Button>
        )}
      </div>
      {addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddress}
          onValueChange={onAddressChange}
          className="gap-3"
        >
          {addresses.map((address) => {
            const config =
              ADDRESS_TYPE_CONFIG[
                address.addressType.toLowerCase() as keyof typeof ADDRESS_TYPE_CONFIG
              ];

            const Icon = config?.icon;

            return (
              <FieldLabel
                key={address._id}
                htmlFor={`address-${address._id}`}
                className="block cursor-pointer"
              >
                <Field
                  orientation="horizontal"
                  className="relative flex items-start gap-4 transition-all 
                   hover:border-primary hover:shadow-sm 
                   has-[input:checked]:border-primary 
                   has-[input:checked]:bg-primary/5"
                >
                  {/* Left Icon */}
                  {Icon && (
                    <IconBadge
                      variant={config.variant}
                      className="mt-1 shrink-0"
                    >
                      <Icon className="size-4" />
                    </IconBadge>
                  )}

                  {/* Content */}
                  <FieldContent className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm capitalize">
                        {address.addressType}
                      </span>

                      {address.isDefault && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5"
                        >
                          Default
                        </Badge>
                      )}
                    </div>

                    <FieldDescription className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {address.address1}
                      {address.address2 && `, ${address.address2}`}
                      <br />
                      {address.city}, {address.state} {address.zipCode}
                      <br />
                      {address.country}
                    </FieldDescription>
                  </FieldContent>

                  {/* Radio (visually secondary) */}
                  <RadioGroupItem
                    value={address._id || ""}
                    id={`address-${address._id}`}
                    className="mt-1"
                  />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-xl bg-muted/20">
          <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto">
            No delivery address found. Please add an address to continue.
          </p>
          <Button variant="default" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        </div>
      )}
    </div>
  );
}
