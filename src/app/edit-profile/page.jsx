"use client";

import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { useEditProfile } from "./hook/useEditProfille";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";

export default function EditProfile () {
    const { form, onSubmit, loading } = useEditProfile();

    const currentYear = new Date().getFullYear()

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
                                <DatePicker
                                    date={field.value ? new Date(field.value) : undefined}
                                    setDate={(date) => {
                                        if (date) {
                                            field.onChange(date);
                                        }
                                    }}
                                    endYear={currentYear}
                                />
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
