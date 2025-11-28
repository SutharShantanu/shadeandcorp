import { MapPin, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
}

export function DeliveryAddress({
    addresses,
    selectedAddress,
    onAddressChange,
}: DeliveryAddressProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery Address
            </h3>
            {addresses.length > 0 ? (
                <RadioGroup value={selectedAddress} onValueChange={onAddressChange}>
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RadioGroupItem
                                    value={address._id || ""}
                                    id={`address-${address._id}`}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor={`address-${address._id}`}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm capitalize">
                                            {address.addressType}
                                        </span>
                                        {address.isDefault && (
                                            <Badge variant="secondary" className="text-xs">
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {address.address1}
                                        {address.address2 && `, ${address.address2}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-sm text-gray-600">{address.country}</p>
                                </Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
            ) : (
                <div className="text-center py-6">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                        No delivery address found. Please add an address to continue.
                    </p>
                    <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                    </Button>
                </div>
            )}
        </div>
    );
}
