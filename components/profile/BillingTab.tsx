"use client";

import { useState, useEffect } from "react";
import { CircleCheck, CreditCard, Plus, Edit, Trash2, Check, X, BadgeCheck } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "../ui/alert";
import { CardInput } from "@/components/ui/card-input";
import { UpiInput } from "@/components/ui/upi-input";
import { paymentMethodSchema, type PaymentMethodFormData } from "@/lib/validations/payment";

interface BillingTabProps {
  userProfile: UserProfile | null;
  shouldOpenModal?: boolean;
  onModalClose?: () => void;
}

interface PaymentMethod {
  id: string;
  type: "credit-card" | "debit-card" | "upi" | "net-banking";
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardHolderName: string;
  upiId?: string;
  accountNumber?: string;
  isDefault: boolean;
}

export default function BillingTab({ userProfile, shouldOpenModal, onModalClose }: BillingTabProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    (userProfile?.paymentMethods || []).map((method: PaymentMethod & { _id?: string }, index: number) => ({
      id: method._id || `pm-${index}`,
      type: method.type || "credit-card",
      cardNumber: method.cardNumber,
      expiryDate: method.expiryDate,
      cvc: method.cvc,
      cardHolderName: method.cardHolderName || "",
      upiId: method.upiId,
      accountNumber: method.accountNumber,
      isDefault: method.isDefault ?? false,
    }))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Form for adding payment method
  const addForm = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onChange",
    defaultValues: {
      type: "credit-card",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardHolderName: "",
      upiId: "",
      accountNumber: "",
      isDefault: false,
    },
  });

  // Form for editing payment method
  const editForm = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    mode: "onChange",
    defaultValues: {
      type: "credit-card",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardHolderName: "",
      upiId: "",
      accountNumber: "",
      isDefault: false,
    },
  });

  const watchAddType = useWatch({ control: addForm.control, name: "type" });
  const watchEditType = useWatch({ control: editForm.control, name: "type" });

  // Auto-open when URL contains action=add
  useEffect(() => {
    if (searchParams?.get("action") === "add") {
      addForm.reset({
        type: "credit-card",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardHolderName: "",
        upiId: "",
        accountNumber: "",
        isDefault: false,
      });
      setIsAddDialogOpen(true);
    }
  }, [searchParams, addForm]);

  // Auto-open modal when shouldOpenModal is true
  useEffect(() => {
    if (shouldOpenModal) {
      addForm.reset({
        type: "credit-card",
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardHolderName: "",
        upiId: "",
        accountNumber: "",
        isDefault: false,
      });
      setIsAddDialogOpen(true);
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [shouldOpenModal, onModalClose, addForm]);

  // Populate edit form when dialog opens
  useEffect(() => {
    if (selectedMethod && isEditDialogOpen) {
      editForm.reset({
        type: selectedMethod.type,
        cardNumber: selectedMethod.cardNumber || "",
        expiryDate: selectedMethod.expiryDate || "",
        cvc: selectedMethod.cvc || "",
        cardHolderName: selectedMethod.cardHolderName,
        upiId: selectedMethod.upiId || "",
        accountNumber: selectedMethod.accountNumber || "",
        isDefault: selectedMethod.isDefault,
      });
    }
  }, [selectedMethod, isEditDialogOpen, editForm]);

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

  const onAddSubmit = async (data: PaymentMethodFormData) => {
    try {
      const response = await fetch("/api/user/profile/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          isDefault: paymentMethods.length === 0 ? true : data.isDefault,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to add payment method");
        return;
      }

      const result = await response.json();

      const newMethod: PaymentMethod = {
        id: result.paymentMethod._id || `pm-${Date.now()}`,
        ...data,
        isDefault: paymentMethods.length === 0 ? true : data.isDefault,
      };

      setPaymentMethods(
        data.isDefault
          ? [...paymentMethods.map(m => ({ ...m, isDefault: false })), newMethod]
          : [...paymentMethods, newMethod]
      );

      toast.success("Payment method added successfully");
      setIsAddDialogOpen(false);
      addForm.reset();

      // Remove action=add from URL
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("action");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("An error occurred while adding payment method");
    }
  };

  const onEditSubmit = (data: PaymentMethodFormData) => {
    if (!selectedMethod) return;

    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === selectedMethod.id
          ? { ...method, ...data }
          : data.isDefault
            ? { ...method, isDefault: false }
            : method
      )
    );

    toast.success("Payment method updated successfully");
    setIsEditDialogOpen(false);
    setSelectedMethod(null);
    editForm.reset();
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

  const openAddDialog = () => {
    addForm.reset({
      type: "credit-card",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      cardHolderName: "",
      upiId: "",
      accountNumber: "",
      isDefault: false,
    });
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

  const handleAddDialogOpenChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open && searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      if (params.has("action")) {
        params.delete("action");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    }
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
                onClick={openAddDialog}
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
                    <Badge variant="default">Default <BadgeCheck className="h-4 w-4" /></Badge>
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
                    {method.type === "net-banking" && method.accountNumber && (
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
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogOpenChange}>
        <DialogContent className="max-w-4xl w-fit p-0 max-h-[90vh] flex flex-col">
          {/* Sticky Header (contains close button automatically) */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background sticky top-0 z-50">
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new payment method for faster checkout.</DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="px-6 py-4 overflow-y-auto">
            <Form {...addForm}>
              {/* Give the form an id so footer outside can submit it */}
              <form id="add-payment-form" onSubmit={addForm.handleSubmit(onAddSubmit)} className="flex flex-col gap-4">
                {/* Payment Type Selection */}
                <FormField
                  control={addForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="debit-card">Debit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="net-banking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Card Payment Fields */}
                {(watchAddType === "credit-card" || watchAddType === "debit-card") && (
                  <CardInput
                    key={watchAddType}
                    form={addForm}
                    cardType={watchAddType}
                    fieldNames={{
                      cardHolderName: "cardHolderName",
                      cardNumber: "cardNumber",
                      expiryDate: "expiryDate",
                      cvc: "cvc",
                    }}
                  />
                )}

                {/* UPI Payment Fields */}
                {watchAddType === "upi" && (
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={addForm.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID *</FormLabel>
                          <FormControl>
                            <UpiInput value={field.value || ""} onChange={field.onChange} placeholder="username@paytm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Net Banking Payment */}
                {watchAddType === "net-banking" && (
                  <>
                    <FormField
                      control={addForm.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Set as Default */}
                <FormField
                  control={addForm.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium">Default Payment Method</FormLabel>
                      <FormControl>
                        <div
                          onClick={() => field.onChange(!field.value)}
                          className={`border p-4 rounded-lg cursor-pointer shadow-sm transition-all ${field.value ? "border-primary bg-primary/5" : "border-border bg-muted/40"}`}
                          aria-pressed={field.value}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg ${field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                              <CircleCheck className="h-5 w-5" />
                            </span>
                            <div className="space-y-1 flex-1">
                              <div className={`text-sm font-semibold ${field.value ? "text-primary" : "text-foreground"}`}>Use as default</div>
                              <p className="text-xs text-muted-foreground">Use this as your primary payment option for faster checkout</p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Footer — outside scrollable area but submits the form via form="add-payment-form" */}
          <DialogFooter className="px-6 py-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button type="submit" form="add-payment-form" disabled={!addForm.formState.isValid}>Add Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------------- */}
      {/* Edit Payment Method Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md w-full p-0 max-h-[90vh] flex flex-col">
          {/* Sticky Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background sticky top-0 z-50">
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>Update your payment method details.</DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="px-6 py-4 overflow-y-auto">
            <Form {...editForm}>
              <form id="edit-payment-form" onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex flex-col gap-4">
                {/* Payment Type Selection */}
                <FormField
                  control={editForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="debit-card">Debit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="net-banking">Net Banking</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Card Payment Fields */}
                {(watchEditType === "credit-card" || watchEditType === "debit-card") && (
                  <CardInput
                    key={watchEditType}
                    form={editForm}
                    cardType={watchEditType}
                    fieldNames={{
                      cardHolderName: "cardHolderName",
                      cardNumber: "cardNumber",
                      expiryDate: "expiryDate",
                      cvc: "cvc",
                    }}
                  />
                )}

                {/* UPI Payment */}
                {watchEditType === "upi" && (
                  <>
                    <FormField
                      control={editForm.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="upiId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI ID *</FormLabel>
                          <FormControl>
                            <UpiInput value={field.value || ""} onChange={field.onChange} placeholder="username@paytm" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Net Banking */}
                {watchEditType === "net-banking" && (
                  <>
                    <FormField
                      control={editForm.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Set as Default */}
                <FormField
                  control={editForm.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium">Default Payment Method</FormLabel>
                      <FormControl>
                        <div
                          onClick={() => field.onChange(!field.value)}
                          className={`border p-4 rounded-lg cursor-pointer shadow-sm transition-all ${field.value ? "border-primary bg-primary/5 ring-2 ring-primary/40" : "border-border bg-muted/40"}`}
                          aria-pressed={field.value}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg ${field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                              <CircleCheck className="h-5 w-5" />
                            </span>
                            <div className="space-y-1 flex-1">
                              <div className={`text-sm font-semibold ${field.value ? "text-primary" : "text-foreground"}`}>Use as default</div>
                              <p className="text-xs text-muted-foreground">Use this as your primary payment option for faster checkout</p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {/* Footer — outside scrollable area but submits the edit form */}
          <DialogFooter className="px-6 py-4 border-t flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button type="submit" form="edit-payment-form">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      < AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
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

