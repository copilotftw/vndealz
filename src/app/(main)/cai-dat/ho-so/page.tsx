'use client'

import { useState, useTransition, useEffect } from 'react'
import { updateProfile, deleteAccount, checkHasPassword } from '@/server/actions/user'
import { authClient } from '@/lib/auth-client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Pencil } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { SettingsHeader } from '@/components/settings/header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [hasPassword, setHasPassword] = useState<boolean | null>(null)
  const t = useTranslations('settings')

  useEffect(() => {
    checkHasPassword().then(setHasPassword)
  }, [])

  if (loading) return null
  
  if (!user) {
    if (typeof window !== 'undefined') router.push('/dang-nhap')
    return null
  }

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await updateProfile(formData)
        toast.success(t('profile.updateSuccess'))
      } catch (err: any) {
        toast.error(err.message || t('profile.updateError'))
      }
    })
  }

  const handleDeleteAccount = () => {
    setIsDeleting(true)
    startTransition(async () => {
      try {
        await deleteAccount()
        await authClient.signOut()
        window.location.href = '/'
      } catch (e: any) {
        toast.error(t('profile.deleteError'))
        setIsDeleting(false)
      }
    })
  }

  return (
    <div className="max-w-2xl text-[var(--color-text)]">
      <form onSubmit={handleUpdateProfile} className="space-y-0">
        <SettingsHeader title={t('profile.title')} isPending={isPending} showSave={true} />
        
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('profile.avatarTitle')}</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">{t('profile.optional')}</p>
          </div>
          <div className="w-2/3 flex flex-col items-center sm:items-start gap-4">
            <div className="relative group">
              <Avatar className="w-32 h-32 ring-2 ring-[var(--color-border)]">
                <AvatarImage src={user.image || ''} />
                <AvatarFallback className="text-2xl font-bold bg-[#f3a41c] text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                <button type="button" className="text-white hover:text-green-400 p-1 transition-colors" title="Change Avatar">
                  <Pencil className="w-5 h-5" />
                </button>
                <div className="w-8 h-px bg-white/20" />
                <button type="button" className="text-white hover:text-red-400 p-1 transition-colors" title="Remove Avatar">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] text-center sm:text-left mt-2">
              {t('profile.avatarHint')}
            </p>
            <input type="hidden" name="avatar" value={user.image || ''} />
          </div>
        </div>

        {/* Username */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('profile.usernameTitle')}</h3>
          </div>
          <div className="w-2/3">
            <Input 
              name="name" 
              defaultValue={user.name} 
              required 
              minLength={3} 
              className="bg-transparent border-[var(--color-border)] focus:border-[var(--color-primary)] font-semibold text-[var(--color-primary)]" 
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              {t('profile.usernameHint')}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3 mt-3">
            <h3 className="font-bold text-sm">{t('profile.bioTitle')}</h3>
          </div>
          <div className="w-2/3">
            <Input 
              name="bio" 
              defaultValue={(user as any).bio || ''} 
              className="bg-transparent border-[var(--color-border)] focus:border-[var(--color-primary)] font-semibold text-[var(--color-primary)]" 
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-b border-black/10 dark:border-white/10">
          <div className="w-1/3">
            <h3 className="font-bold text-sm">{t('profile.emailTitle')}</h3>
          </div>
          <div className="w-2/3">
            <Input 
              type="email"
              name="email" 
              defaultValue={user.email} 
              required
              className="bg-transparent border-[var(--color-border)] focus:border-[var(--color-primary)] font-semibold text-[var(--color-primary)]" 
            />
          </div>
        </div>

        {/* Password Section */}
        {hasPassword !== null && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-b border-black/10 dark:border-white/10">
            <div className="w-1/3">
              <h3 className="font-bold text-sm">
                {hasPassword ? t('profile.changePasswordTitle') : t('profile.passwordTitle')}
              </h3>
            </div>
            <div className="w-2/3">
              <p className="text-xl font-bold text-white mb-4">...</p>
              <Button variant="outline" type="button" className="w-full sm:w-auto bg-transparent border-white/20 text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full px-8 transition-colors">
                {hasPassword ? t('profile.changePassword') : t('profile.addPassword')}
              </Button>
              {!hasPassword && (
                <p className="text-xs text-[var(--color-text-muted)] mt-2">
                  {t('profile.passwordHint')}
                </p>
              )}
            </div>
          </div>
        )}
      </form>

      {/* User Data Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-t border-black/10 dark:border-white/10 mt-8">
        <div className="w-1/3">
          <h3 className="font-bold text-sm">{t('profile.userDataTitle')}</h3>
        </div>
        <div className="w-2/3">
          <Button variant="outline" type="button" className="w-full bg-transparent border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            {t('profile.generateData')}
          </Button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-8 border-y border-black/10 dark:border-white/10 mt-0">
        <div className="w-1/3">
          <h3 className="font-bold text-sm">{t('profile.deleteAccountTitle')}</h3>
        </div>
        <div className="w-2/3">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" className="w-full sm:w-auto bg-transparent border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-full px-8 transition-colors" />}>
              {t('profile.deleteAccountBtn')}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1b1b1b] border-none text-white rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle>{t('profile.deleteConfirmTitle')}</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  {t('profile.deleteConfirmDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white rounded-full">
                  {t('profile.cancel')}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-[#ff5555] text-white hover:bg-[#ff5555]/90 rounded-full"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t('profile.deletePermanent')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
