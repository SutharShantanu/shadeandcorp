import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { UserProfile } from "@/app/(auth)/hook/useProfile";
import {
  paymentMethodSchema,
  type PaymentMethodFormData,
} from "@/lib/validations/payment";

export interface PaymentMethod {
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

export function useBilling(
  userProfile: UserProfile | null,
  shouldOpenModal?: boolean,
  onModalClose?: () => void
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    (userProfile?.paymentMethods || []).map(
      (method: PaymentMethod & { _id?: string }, index: number) => ({
        id: method._id || `pm-${index}`,
        type: method.type || "credit-card",
        cardNumber: method.cardNumber,
        expiryDate: method.expiryDate,
        cvc: method.cvc,
        cardHolderName: method.cardHolderName || "",
        upiId: method.upiId,
        accountNumber: method.accountNumber,
        isDefault: method.isDefault ?? false,
      })
    )
  );
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [alertDismissed, setAlertDismissed] = useState(false);

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
          ? [
              ...paymentMethods.map((m) => ({ ...m, isDefault: false })),
              newMethod,
            ]
          : [...paymentMethods, newMethod]
      );

      toast.success("Payment method added successfully");
      setIsAddDialogOpen(false);
      addForm.reset();

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete("action");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
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

    const newMethods = paymentMethods.filter(
      (method) => method.id !== selectedMethod.id
    );

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
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }
    }
  };

  return {
    paymentMethods,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedMethod,
    alertDismissed,
    setAlertDismissed,
    addForm,
    editForm,
    watchAddType,
    watchEditType,
    handleSetDefault,
    onAddSubmit,
    onEditSubmit,
    handleDeleteMethod,
    openAddDialog,
    openEditDialog,
    openDeleteDialog,
    handleAddDialogOpenChange,
    maskCardNumber,
  };
}
