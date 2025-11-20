"use client";

import { useState } from "react";
import { Upload, Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileForm, UserProfile } from "@/app/(auth)/hook/useProfile";

interface ProfileTabProps {
  form: ProfileForm;
  loading: boolean;
  showErrors: boolean;
  onSubmit: (e: React.FormEvent) => void;
  userProfile: UserProfile | null;
}

export default function ProfileTab({
  form,
  loading,
  showErrors,
  onSubmit,
  userProfile,
}: ProfileTabProps) {
  const [urls, setUrls] = useState<string[]>(
    form.watch("urls") || []
  );

  const addUrl = () => {
    const newUrls = [...urls, ""];
    setUrls(newUrls);
    form.setValue("urls", newUrls);
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    form.setValue("urls", newUrls);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    form.setValue("urls", newUrls);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a storage service and get the URL
      // For now, we'll use a placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = userProfile
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || userProfile.firstName || "User"
    : form.watch("firstName") || "User";

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <Avatar className="size-20">
            <AvatarImage
              src={form.watch("profilePicture") || userProfile?.profilePicture}
              alt={displayName}
            />
            <AvatarFallback className="text-lg">
              {displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("profile-picture")?.click()}
            >
              <Upload className="size-4 mr-2" />
              Upload image
            </Button>
          </div>
        </div>

        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Your first name.
              </FormDescription>
              {showErrors && <FormMessage />}
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
              <FormControl>
                <Input
                  placeholder="Doe"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Your last name.
              </FormDescription>
              {showErrors && <FormMessage />}
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
              <Select
                value={field.value || userProfile?.email || ""}
                onValueChange={field.onChange}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={field.value || userProfile?.email || ""}>
                    {field.value || userProfile?.email || "No email"}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage verified email addresses in your email settings.
              </FormDescription>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations to link to them.
              </FormDescription>
              {showErrors && <FormMessage />}
            </FormItem>
          )}
        />

        {/* URLs */}
        <div className="space-y-2">
          <FormLabel>URLs</FormLabel>
          <FormDescription>
            Add links to your website, blog, or social media profiles.
          </FormDescription>
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeUrl(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addUrl}
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Add URL
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="size-4 mr-2" />
                Updating...
              </>
            ) : (
              "Update profile"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

