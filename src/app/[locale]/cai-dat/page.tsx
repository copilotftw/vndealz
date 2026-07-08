'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/server/actions/user'
import { authClient } from '@/lib/auth-client'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from '@/i18n/navigation'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
  
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
        toast.success('Cập nhật hồ sơ thành công!')
      } catch (err: any) {
        toast.error(err.message || 'Có lỗi xảy ra')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Cài đặt</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Quản lý thông tin cá nhân và tùy chọn tài khoản của bạn.</p>
      </div>

      <div className="glass-strong p-6 md:p-8 rounded-[var(--border-radius-xl)] shadow-lg border border-[var(--color-border)]/50">
        <h2 className="text-xl font-semibold mb-6">Hồ sơ cá nhân</h2>
        
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <Avatar className="w-20 h-20 ring-2 ring-[var(--color-border)]">
              <AvatarImage src={user.image || ''} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1 w-full">
              <Label htmlFor="avatar">URL Ảnh đại diện</Label>
              <Input id="avatar" name="avatar" defaultValue={user.image || ''} placeholder="https://..." className="bg-white/50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên hiển thị</Label>
            <Input id="name" name="name" defaultValue={user.name} required minLength={3} className="bg-white/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              defaultValue={(user as any).bio || ''} 
              placeholder="Vài dòng về bản thân..." 
              className="bg-white/50 resize-y"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:opacity-90">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Lưu thay đổi
          </Button>
        </form>
      </div>

      <div className="glass-strong p-6 md:p-8 rounded-[var(--border-radius-xl)] shadow-lg border border-[var(--color-border)]/50">
        <h2 className="text-xl font-semibold mb-6 text-red-500">Đăng xuất</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Bạn muốn đăng xuất khỏi thiết bị này?
        </p>
        <Button 
          variant="destructive"
          onClick={() => {
            authClient.signOut()
            router.push('/')
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
