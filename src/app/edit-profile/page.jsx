"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useEditProfile } from "./hook/useEditProfille";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDatePicker } from "@/components/ui/calenderDatePicker";
import { useState } from "react";

export default function EditProfile () {
    const { form, onSubmit, loading } = useEditProfile();

    const [selectedDateRange, setSelectedDateRange] = useState({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
    });

    return (
        <div className="max-w-3xl mx-auto py-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    {/* First Name */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl><Input placeholder="John" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Last Name */}
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl><PhoneInput defaultCountry="IN" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gender */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="don't know">Don't Know</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Birthday */}
                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Birthday</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="w-auto p-0">
                                        <CalendarDatePicker
                                            date={selectedDateRange}
                                            onDateSelect={setSelectedDateRange}
                                        />
                                        <div className="mt-4">
                                            <h2 className="text-md font-semibold">Selected Date Range:</h2>
                                            <p className="text-sm">
                                                {selectedDateRange.from.toDateString()} -{" "}
                                                {selectedDateRange.to.toDateString()}
                                            </p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>Your birthdate helps us personalize your experience.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Address Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["address1", "address2", "city", "state", "zipCode", "country"].map((fieldName, idx) => (
                            <FormField
                                key={idx}
                                control={form.control}
                                name={fieldName}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{fieldName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`Enter ${fieldName}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>

                    {/* Submit */}
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
