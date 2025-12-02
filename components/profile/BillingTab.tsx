"use client";

import { useState, useEffect } from "react";
import { CreditCard, Plus, Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { useRouter } from "next/navigation";

interface BillingTabProps {
  userProfile: UserProfile | null;
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}

interface PaymentMethod {
  id: string;
  type: "credit-card" | "debit-card" | "upi" | "net-banking" | "other";
  cardNumber?: string;
  expiryDate?: string;
  cardHolderName: string;
  upiId?: string;
  accountNumber?: string;
  isDefault: boolean;
}

export default function BillingTab({ userProfile, shouldOpenModal, onModalClose }: BillingTabProps) {
  const router = useRouter();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    (userProfile?.paymentMethods || []).map((method: any, index: number) => ({
      id: method._id || `pm-${index}`,
      type: method.type || "credit-card",
      cardNumber: method.cardNumber,
      expiryDate: method.expiryDate,
      cardHolderName: method.cardHolderName || "",
      upiId: method.upiId,
      accountNumber: method.accountNumber,
      isDefault: method.isDefault || false,
    }))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, "id">>({
    type: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    upiId: "",
    accountNumber: "",
    isDefault: false,
  });

  // Auto-open modal when shouldOpenModal is true
  useEffect(() => {
    if (shouldOpenModal) {
      openAddDialog();
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [shouldOpenModal, onModalClose]);

  useEffect(() => {
    if (selectedMethod && isEditDialogOpen) {
      setFormData({
        type: selectedMethod.type,
        cardNumber: selectedMethod.cardNumber || "",
        expiryDate: selectedMethod.expiryDate || "",
        cardHolderName: selectedMethod.cardHolderName,
        upiId: selectedMethod.upiId || "",
        accountNumber: selectedMethod.accountNumber || "",
        isDefault: selectedMethod.isDefault,
      });
    }
  }, [selectedMethod, isEditDialogOpen]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setFormData({ ...formData, cardNumber: cleaned });
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 4) {
      let formatted = cleaned;
      if (cleaned.length >= 2) {
        formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      }
      setFormData({ ...formData, expiryDate: formatted });
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    return "**** **** **** " + cardNumber.slice(-4);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success("Default payment method updated");
  };

  const handleAddMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      ...formData,
      isDefault: paymentMethods.length === 0 ? true : formData.isDefault,
    };

    setPaymentMethods(
      formData.isDefault
        ? [...paymentMethods.map(m => ({ ...m, isDefault: false })), newMethod]
        : [...paymentMethods, newMethod]
    );

    toast.success("Payment method added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditMethod = () => {
    if (!selectedMethod) return;

    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === selectedMethod.id
          ? { ...method, ...formData }
          : formData.isDefault
            ? { ...method, isDefault: false }
            : method
      )
    );

    toast.success("Payment method updated successfully");
    setIsEditDialogOpen(false);
    setSelectedMethod(null);
    resetForm();
  };

  const handleDeleteMethod = () => {
    if (!selectedMethod) return;

    const newMethods = paymentMethods.filter((method) => method.id !== selectedMethod.id);

    // If deleted method was default, set first remaining method as default
    if (selectedMethod.isDefault && newMethods.length > 0) {
      newMethods[0].isDefault = true;
    }

    setPaymentMethods(newMethods);
    toast.success("Payment method deleted successfully");
    setIsDeleteDialogOpen(false);
    setSelectedMethod(null);
  };

  const resetForm = () => {
    setFormData({
      type: "credit-card",
      cardNumber: "",
      expiryDate: "",
      cardHolderName: "",
      upiId: "",
      accountNumber: "",
      isDefault: false,
    });
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods and billing information.
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {paymentMethods.length === 0 && !alertDismissed && (
        <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
          <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-500" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">No payment methods added yet</p>
              <p className="text-sm text-blue-700 dark:text-blue-400">Add a payment method for faster and secure checkout</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                size="sm"
                onClick={() => router.push('/edit-profile?tab=billing&action=add')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Payment
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setAlertDismissed(true)}
                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {paymentMethods.length === 0 && alertDismissed ? null : paymentMethods.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {method.cardHolderName}
                  </CardTitle>
                  {method.isDefault && (
                    <Badge variant="default">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <Badge variant="outline" className="mb-2 capitalize">
                      {method.type.replace("-", " ")}
                    </Badge>
                    {method.type === "upi" && method.upiId && (
                      <p className="font-medium">{method.upiId}</p>
                    )}
                    {(method.type === "credit-card" || method.type === "debit-card") && method.cardNumber && (
                      <>
                        <p className="font-medium font-mono">{maskCardNumber(method.cardNumber)}</p>
                        <p className="text-muted-foreground">Expires: {method.expiryDate}</p>
                      </>
                    )}
                    {(method.type === "net-banking" || method.type === "other") && method.accountNumber && (
                      <p className="font-medium font-mono">****{method.accountNumber.slice(-4)}</p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Set as Default
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(method)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(method)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method for faster checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "credit-card" | "debit-card" | "upi" | "net-banking" | "other") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="net-banking">Net Banking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardHolderName">{formData.type === "upi" ? "UPI Name" : "Account Holder Name"} *</Label>
              <Input
                id="cardHolderName"
                value={formData.cardHolderName}
                onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            {/* UPI Fields */}
            {formData.type === "upi" && (
              <div className="grid gap-2">
                <Label htmlFor="upiId">UPI ID *</Label>
                <Input
                  id="upiId"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="username@upi"
                />
              </div>
            )}

            {/* Card Fields */}
            {(formData.type === "credit-card" || formData.type === "debit-card") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={formatCardNumber(formData.cardNumber || "")}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date (MM/YY) *</Label>
                  <Input
                    id="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
              </>
            )}

            {/* Net Banking / Other Fields */}
            {(formData.type === "net-banking" || formData.type === "other") && (
              <div className="grid gap-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Account number"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default payment method
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMethod}
              disabled={
                !formData.cardHolderName ||
                (formData.type === "upi" && !formData.upiId) ||
                ((formData.type === "credit-card" || formData.type === "debit-card") &&
                  (!formData.cardNumber || formData.cardNumber.length !== 16 || !formData.expiryDate || formData.expiryDate.length !== 5)) ||
                ((formData.type === "net-banking" || formData.type === "other") && !formData.accountNumber)
              }
            >
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>
              Update your payment method details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-paymentType">Payment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "credit-card" | "debit-card" | "upi" | "net-banking" | "other") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="net-banking">Net Banking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-cardHolderName">{formData.type === "upi" ? "UPI Name" : "Account Holder Name"} *</Label>
              <Input
                id="edit-cardHolderName"
                value={formData.cardHolderName}
                onChange={(e) => setFormData({ ...formData, cardHolderName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            {/* UPI Fields */}
            {formData.type === "upi" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-upiId">UPI ID *</Label>
                <Input
                  id="edit-upiId"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="username@upi"
                />
              </div>
            )}

            {/* Card Fields */}
            {(formData.type === "credit-card" || formData.type === "debit-card") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-cardNumber">Card Number *</Label>
                  <Input
                    id="edit-cardNumber"
                    value={formatCardNumber(formData.cardNumber || "")}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-expiryDate">Expiry Date (MM/YY) *</Label>
                  <Input
                    id="edit-expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
              </>
            )}

            {/* Net Banking / Other Fields */}
            {(formData.type === "net-banking" || formData.type === "other") && (
              <div className="grid gap-2">
                <Label htmlFor="edit-accountNumber">Account Number *</Label>
                <Input
                  id="edit-accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Account number"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-isDefault" className="cursor-pointer">
                Set as default payment method
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditMethod}
              disabled={
                !formData.cardHolderName ||
                (formData.type === "upi" && !formData.upiId) ||
                ((formData.type === "credit-card" || formData.type === "debit-card") &&
                  (!formData.cardNumber || formData.cardNumber.length !== 16 || !formData.expiryDate || formData.expiryDate.length !== 5)) ||
                ((formData.type === "net-banking" || formData.type === "other") && !formData.accountNumber)
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
              {selectedMethod?.isDefault && paymentMethods.length > 1 && (
                <span className="block mt-2 text-amber-600 dark:text-amber-500">
                  Note: The first remaining payment method will be set as your new default.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMethod} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

