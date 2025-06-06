import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { PhoneInput } from "@/components/ui/phone-input";

const PhoneField = ({
  name,
  label,
  control,
  placeholder,
  defaultCountry,
  countryCallingCodeEditable,
  international,
  description,
  required,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && (
            <FormDescription className="text-sm text-muted-foreground mb-1">
              {description}
            </FormDescription>
          )}
          <FormControl>
            <motion.div
              whileFocus={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <PhoneInput
                {...field}
                placeholder={placeholder}
                defaultCountry={defaultCountry}
                countryCallingCodeEditable={countryCallingCodeEditable}
                international={international}
                required={required}
              />
            </motion.div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { PhoneField };
