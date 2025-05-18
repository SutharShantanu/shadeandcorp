"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useAuthInfo = () => {
  const { data: session, status } = useSession();

  const [isReady, setIsReady] = useState(false);
  const user = session?.user || null;

  useEffect(() => {
    if (status !== "loading") {
      setIsReady(true);
    }
  }, [status]);

  return {
    session: session || null,
    user,
    isAuthenticated: status === "authenticated",
    isUnauthenticated: status === "unauthenticated",
    isReady,
  };
};
