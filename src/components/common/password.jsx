import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { motion } from "framer-motion";
import { PasswordInput } from "@/components/ui/password-input";

const PasswordField = ({ name, label, control, description, placeholder, required }) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    {description && <FormDescription className="text-sm text-muted-foreground mb-1">{description}</FormDescription>}
                    <FormControl>
                        <motion.div whileFocus={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <PasswordInput {...field} placeholder={placeholder} required={required} />
                        </motion.div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export { PasswordField };
