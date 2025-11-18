"use client";

import { Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface DisplayTabProps {
  userProfile: UserProfile | null;
}

export default function DisplayTab({ userProfile }: DisplayTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Display</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your display preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Customize how content is displayed to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Display settings will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

