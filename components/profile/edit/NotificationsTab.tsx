"use client";

import { Bell, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { IconBadge } from "@/components/ui/icon-badge";

interface NotificationsTabProps {
  userProfile: UserProfile | null;
}

export default function NotificationsTab({ userProfile }: NotificationsTabProps) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your notifications and appearance preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBadge variant="default" size="sm">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </IconBadge>
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification settings will be available soon.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBadge variant="default" size="sm">
              <Palette className="h-4 w-4 text-muted-foreground" />
            </IconBadge>
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the application looks to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Select your preferred theme for the application.
            </p>
            <div className="flex gap-4">
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>
    </div >
  );
}

