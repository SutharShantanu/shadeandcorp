import { SignupForm } from "@/app/(auth)/hook/useSignup";

export interface EmailSignupFormProps {
  form: SignupForm;
  loading: boolean;
  onSwitchToPhone: () => void;
}

export interface PhoneSignupFormProps {
  form: SignupForm;
  loading: boolean;
  isSendingOtp: boolean;
}

export interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  otp: string;
  onOtpChange: (value: string) => void;
  loading: boolean;
  onVerify: () => void;
  onResend: () => void;
}
