import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DefaultInputTypes, InputState } from "../enums/profile.enums";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/common/password";
import { PhoneInput } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { isFieldRequired } from "@/lib/requiredField";

const InputField = ({
  form,
  name,
  label,
  placeholder,
  schema,
  type = DefaultInputTypes.TEXT,
  componentProps = {},
  state = InputState.DEFAULT,
}) => {
  const isReadOnly = state === InputState.READONLY;
  const isDisabled = state === InputState.DISABLED;

  let Component;
  switch (type) {
    case DefaultInputTypes.PHONE:
      Component = PhoneInput;
      break;
    case DefaultInputTypes.PASSWORD:
      Component = PasswordField;
      break;
    default:
      Component = Input;
  }

  label = name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  const isRequired = schema && isFieldRequired(schema, name);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const commonProps = {
          ...field,
          placeholder: placeholder || `Enter ${name}`,
          readOnly: isReadOnly,
          disabled: isDisabled,
          className: cn(
            "bg-primary-foreground",
            isReadOnly && "bg-gray-100 cursor-not-allowed text-gray-600",
            isDisabled && "opacity-50 cursor-not-allowed",
            componentProps.className
          ),
        };

        const phoneProps =
          type === DefaultInputTypes.PHONE ?
            {
              defaultCountry: componentProps.defaultCountry,
              countryCallingCodeEditable:
                componentProps.countryCallingCodeEditable,
              international: componentProps.international,
            }
          : {};

        return (
          <FormItem>
            <FormLabel required={isRequired}>{label}</FormLabel>
            <FormControl>
              {type === DefaultInputTypes.PHONE ?
                <Component {...commonProps} {...phoneProps} />
              : <Component {...commonProps} />}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;
