'use client'
import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const { data: session, isPending: loading } = authClient.useSession()
  return { session, loading, user: session?.user || null }
}
