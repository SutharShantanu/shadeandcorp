import { SignupForm } from "@/app/(auth)/hook/useSignup";

export interface EmailSignupFormProps {
  form: SignupForm;
  loading: boolean;
  onSwitchToPhone: () => void;
}

export interface PhoneSignupFormProps {
  form: SignupForm;
  loading: boolean;
}

export type BaseFormValues = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  password: string;
};