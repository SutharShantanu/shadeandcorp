// Client-side Firebase (OTP sending happens here)
import { initializeApp, getApps } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MSID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const firebaseAuth = getAuth(firebaseApp);

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
