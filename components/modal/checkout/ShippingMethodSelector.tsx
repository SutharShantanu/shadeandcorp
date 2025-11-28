import { Truck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingMethod {
    id: string;
    name: string;
    price: number;
    estimatedDays: string;
    icon: any;
}

interface ShippingMethodSelectorProps {
    methods: ShippingMethod[];
    selectedMethod: string;
    onMethodChange: (methodId: string) => void;
}

export function ShippingMethodSelector({
    methods,
    selectedMethod,
    onMethodChange,
}: ShippingMethodSelectorProps) {
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Method
            </h3>
            <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
                <div className="space-y-3">
                    {methods.map((method) => {
                        const Icon = method.icon;
                        return (
                            <div
                                key={method.id}
                                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <RadioGroupItem
                                    value={method.id}
                                    id={`shipping-${method.id}`}
                                />
                                <Label
                                    htmlFor={`shipping-${method.id}`}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-gray-600" />
                                            <div>
                                                <span className="font-medium text-sm">
                                                    {method.name}
                                                </span>
                                                <p className="text-xs text-gray-600">
                                                    {method.estimatedDays}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-sm">
                                            {method.price === 0 ? "FREE" : `$${method.price}`}
                                        </span>
                                    </div>
                                </Label>
                            </div>
                        );
                    })}
                </div>
            </RadioGroup>
        </div>
    );
}
