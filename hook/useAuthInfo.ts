"use client"

import { useSession } from "next-auth/react"

export function useAuthInfo() {
  const { data: session, status } = useSession()
  const isReady = status !== "loading"
  return { isReady, session }
}

export default useAuthInfo
