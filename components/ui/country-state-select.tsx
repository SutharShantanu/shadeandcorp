"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Country, State, City } from "country-state-city";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  className,
  disabled,
  placeholder = "Select country...",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const countries = Country.getAllCountries();

  const selectedCountry = countries.find(
    (country) => country.isoCode === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedCountry ? selectedCountry.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {countries.map((country) => (
                  <CommandItem
                    key={country.isoCode}
                    value={country.name}
                    onSelect={() => {
                      onChange(country.isoCode);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === country.isoCode
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {country.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface StateSelectProps {
  countryCode: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function StateSelect({
  countryCode,
  value,
  onChange,
  className,
  disabled,
  placeholder = "Select state...",
}: StateSelectProps) {
  const [open, setOpen] = useState(false);
  const states = countryCode ? State.getStatesOfCountry(countryCode) : [];

  const selectedState = states.find((state) => state.isoCode === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || !countryCode}
        >
          {selectedState ? selectedState.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search state/region..." />
          <CommandList>
            <CommandEmpty>No state/region found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {states.map((state) => (
                  <CommandItem
                    key={state.isoCode}
                    value={state.name}
                    onSelect={() => {
                      onChange(state.isoCode);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === state.isoCode ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {state.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface CitySelectProps {
  countryCode: string;
  stateCode: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function CitySelect({
  countryCode,
  stateCode,
  value,
  onChange,
  className,
  disabled,
  placeholder = "Select city...",
}: CitySelectProps) {
  const [open, setOpen] = useState(false);
  const cities = countryCode && stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || !countryCode || !stateCode}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-72">
                {cities.map((city) => (
                  <CommandItem
                    key={city.name}
                    value={city.name}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
