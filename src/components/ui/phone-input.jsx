import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

const PhoneInput = React.forwardRef((props, ref) => {
  const { className, onChange, ...rest } = props;
  return (
    <RPNInput.default
      ref={ref}
      className={cn("flex", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      onChange={(value) => {
        if (value) onChange?.(value);
      }}
      {...rest}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Input
      className={cn(
        "rounded-e-xs rounded-s-none border border-border bg-input text-foreground",
        className
      )}
      {...rest}
      placeholder="+XX XXXXX XXXXX"
      ref={ref}
    />
  );
});
InputComponent.displayName = "InputComponent";

const CountrySelect = ({ disabled, value, onChange, options }) => {
  const handleSelect = React.useCallback(
    (country) => {
      onChange(country);
    },
    [onChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className="flex gap-1 rounded-e-none rounded-s-xs border-border border-r-0 px-3 bg-secondary-default text-secondary-foreground focus:z-10"
          disabled={disabled}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              "-mr-2 h-4 w-4 text-muted-foreground",
              disabled ? "hidden" : "opacity-100"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-[300px] p-0 bg-popover-default text-popover-foreground border border-border"
      >
        <Command>
          <CommandInput
            placeholder="Search country..."
            className="border border-border bg-input text-foreground my-2 px-2 h-8"
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2 hover:bg-muted-default"
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-description">
                        {option.label}
                      </span>
                      {option.value && (
                        <span className="text-muted-foreground text-small">
                          {`+${RPNInput.getCountryCallingCode(option.value)}`}
                        </span>
                      )}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4 text-accent-default",
                          option.value === value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="bg-muted-default flex h-4 w-6 overflow-hidden rounded-xs [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
export { PhoneInput };
