"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CreditCard as CreditCardIcon, Lock } from "lucide-react";

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  return parts.length ? parts.join(" ") : v;
};

const getCardType = (number) => {
  const cleanNumber = number.replace(/\s/g, "");
  if (cleanNumber.startsWith("4")) return "visa";
  if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2"))
    return "mastercard";
  if (cleanNumber.startsWith("3")) return "amex";
  return "generic";
};

const validateCreditCard = (value) => {
  const errors = {};

  if (!value.cardholderName?.trim()) {
    errors.cardholderName = "Cardholder name is required";
  } else if (value.cardholderName.trim().length < 2) {
    errors.cardholderName = "Name must be at least 2 characters";
  }

  const cleanCardNumber = value.cardNumber?.replace(/\s/g, "") || "";
  if (!cleanCardNumber) {
    errors.cardNumber = "Card number is required";
  } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    errors.cardNumber = "Invalid card number length";
  } else if (!/^\d+$/.test(cleanCardNumber)) {
    errors.cardNumber = "Card number must contain only digits";
  }

  if (!value.expiryMonth?.trim()) {
    errors.expiryMonth = "Expiry month is required";
  }

  if (!value.expiryYear?.trim()) {
    errors.expiryYear = "Expiry year is required";
  } else if (value.expiryMonth && value.expiryYear) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryYear = parseInt(value.expiryYear);
    const expiryMonth = parseInt(value.expiryMonth);

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      errors.expiryYear = "Card has expired";
    }
  }

  const cardType = getCardType(value.cardNumber || "");
  const expectedCvvLength = cardType === "amex" ? 4 : 3;
  if (!value.cvv?.trim()) {
    errors.cvv = `${value.cvvLabel || "CVC"} is required`;
  } else if (value.cvv.length !== expectedCvvLength) {
    errors.cvv = `${value.cvvLabel || "CVC"} must be ${expectedCvvLength} digits`;
  } else if (!/^\d+$/.test(value.cvv)) {
    errors.cvv = `${value.cvvLabel || "CVC"} must contain only digits`;
  }

  return errors;
};

function CreditCard({ value, onChange, onValidationChange, className, ref }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const containerRef = useRef(null);
  const cardholderInputRef = useRef(null);
  const cardNumberInputRef = useRef(null);
  const cvvInputRef = useRef(null);

  const currentValue = value || {
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cvvLabel: "CVC",
  };

  const validateAndUpdate = (newValue) => {
    const validationErrors = validateCreditCard(newValue);
    setErrors(validationErrors);

    const isValid = Object.keys(validationErrors).length === 0;
    onValidationChange?.(isValid, validationErrors);

    return isValid;
  };

  const handleInputChange = (field, newValue) => {
    const updatedValue = { ...currentValue, [field]: newValue };
    onChange?.(updatedValue);
    validateAndUpdate(updatedValue);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 19) {
      handleInputChange("cardNumber", formatted);
    }
  };

  const handleCvvFocus = () => {
    setIsFlipped(true);
    setFocusedField("cvv");
  };

  const handleCvvBlur = () => {
    setIsFlipped(false);
    setFocusedField(null);
  };

  const handleFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = () => {
    setFocusedField(null);
  };

  const handleValidate = () => {
    const isValid = validateAndUpdate(currentValue);
    if (!isValid) {
      if (errors.cardholderName) cardholderInputRef.current?.focus();
      else if (errors.cardNumber) cardNumberInputRef.current?.focus();
      else if (errors.cvv) cvvInputRef.current?.focus();
    }
    return isValid;
  };

  const handleReset = () => {
    setErrors({});
    setFocusedField(null);
    setIsFlipped(false);
    onChange?.({
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cvvLabel: "CVC",
    });
  };

  const handleFocus = () => {
    cardholderInputRef.current?.focus();
  };

  const getErrors = () => errors;

  useEffect(() => {
    if (ref && "current" in ref) {
      ref.current = {
        validate: handleValidate,
        isValid: () =>
          Object.keys(validateCreditCard(currentValue)).length === 0,
        focus: handleFocus,
        reset: handleReset,
        getErrors,
      };
    }
  }, [ref, currentValue, errors]);

  const cardType = getCardType(currentValue.cardNumber);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString().padStart(2, "0"),
      label: month.toString().padStart(2, "0"),
    };
  });

  return (
    <div ref={containerRef} className={cn("w-full max-w-sm py-2", className)}>
      {/* All JSX remains unchanged; omitted here to save space */}
    </div>
  );
}

CreditCard.displayName = "CreditCard";

export { CreditCard };
