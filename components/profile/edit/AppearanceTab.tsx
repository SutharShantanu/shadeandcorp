"use client";

import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface AppearanceTabProps {
  userProfile: UserProfile | null;
}

export default function AppearanceTab({ userProfile }: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Customize the appearance of your account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>
            Choose how the application looks to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Theme settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

