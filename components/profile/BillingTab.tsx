"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";

interface BillingTabProps {
  userProfile: UserProfile | null;
}

export default function BillingTab({ userProfile }: BillingTabProps) {
  const paymentMethods = userProfile?.paymentMethods || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your payment methods and billing information.
        </p>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No payment methods added yet.
            </p>
            <Button variant="outline">Add Payment Method</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  {method.cardHolderName}
                  {method.isDefault && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  **** **** **** {method.cardNumber.slice(-4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expires: {method.expiryDate}
                </p>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline">Add Payment Method</Button>
        </div>
      )}
    </div>
  );
}

