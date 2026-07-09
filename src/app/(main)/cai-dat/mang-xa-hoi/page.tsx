'use client'

import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import { Button } from '@/components/ui/button'
import { Apple, Loader2 } from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { getConnectedAccounts } from '@/server/actions/settings'
import { checkHasPassword } from '@/server/actions/user'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function SocialPage() {
  const t = useTranslations('settings')
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [providers, setProviders] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProviders = () => {
    getConnectedAccounts().then(data => {
      setProviders(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const handleLink = async (provider: 'google' | 'apple') => {
    startTransition(async () => {
      const { data, error } = await authClient.linkSocial({
        provider
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success(t('updateSuccess'))
        fetchProviders()
      }
    })
  }

  const handleUnlink = async (provider: 'google' | 'apple') => {
    startTransition(async () => {
      const hasPassword = await checkHasPassword()
      if (!hasPassword && providers.length <= 1) {
        toast.error(t('social.needPasswordToDisconnect'))
        return
      }

      const { data, error } = await authClient.unlinkAccount({
        providerId: provider
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success(t('updateSuccess'))
        fetchProviders()
      }
    })
  }

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>

  const isGoogleConnected = providers.includes('google')
  const isAppleConnected = providers.includes('apple')

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <SettingsHeader title={t('social.title')} showSave={false} />

      <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
        <div className="w-1/3">
          <h3 className="font-bold text-sm">{t('social.connectAccount')}</h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('social.optional')}</p>
        </div>
        <div className="w-2/3 space-y-6">
          
          {/* Google */}
          {isGoogleConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleUnlink('google')}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('social.disconnect')}
                </Button>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {t('social.connectHint')}
              </p>
            </div>
          ) : (
            <div>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleLink('google')}
                disabled={isPending}
                className="bg-transparent border-white/20 text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-8 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {t('social.connectGoogle')}
              </Button>
            </div>
          )}

          {/* Apple */}
          {isAppleConnected ? (
            <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[var(--color-text)]">
                    <Apple className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleUnlink('apple')}
                  disabled={isPending}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('social.disconnect')}
                </Button>
              </div>
            </div>
          ) : (
            <div className={isGoogleConnected ? "pt-4 border-t border-black/10 dark:border-white/10" : ""}>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleLink('apple')}
                disabled={isPending}
                className="bg-black text-white hover:bg-black/90 dark:bg-[#1b1b1b] dark:border-white/20 dark:text-white dark:hover:bg-white/10 rounded-full px-8 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Apple className="w-5 h-5 mr-2" />}
                {t('social.connectApple')}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
