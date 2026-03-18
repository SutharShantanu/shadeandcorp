import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { IconBadge } from "@/components/ui/icon-badge";

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
    <div className="space-y-4">
      <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
        <div className="grid gap-3">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <FieldLabel
                key={method.id}
                htmlFor={`shipping-${method.id}`}
                className="block cursor-pointer"
              >
                <Field
                  orientation="horizontal"
                  className="relative flex items-center gap-4 transition-all 
                   hover:border-primary hover:shadow-sm 
                   has-[input:checked]:border-primary 
                   has-[input:checked]:bg-primary/5 p-4"
                >
                  {/* Selection Radio */}
                  <RadioGroupItem
                    value={method.id}
                    id={`shipping-${method.id}`}
                    className="shrink-0"
                  />

                  {/* Icon Badge */}
                  <IconBadge variant="info" size="sm" className="shrink-0">
                    <Icon className="size-4" />
                  </IconBadge>

                  {/* Content */}
                  <FieldContent className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-sm">
                          {method.name}
                        </span>
                        <FieldDescription className="text-xs text-muted-foreground mt-0.5">
                          {method.estimatedDays}
                        </FieldDescription>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {method.price === 0 ? "FREE" : `$${method.price}`}
                      </span>
                    </div>
                  </FieldContent>
                </Field>
              </FieldLabel>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
