// Client-side Firebase (OTP sending happens here)
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY || "mock_key",
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN || "mock_domain",
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID || "mock_id",
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET || "mock_bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MSID || "mock_msid",
  appId: process.env.NEXT_PUBLIC_FB_APP_ID || "mock_app_id",
};

export const firebaseApp = !getApps().length && firebaseConfig.apiKey !== "mock_key"
  ? initializeApp(firebaseConfig)
  : getApps().length ? getApps()[0] : null as any;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null as any;


// OTP Recaptcha Setup
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      firebaseAuth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }
};
