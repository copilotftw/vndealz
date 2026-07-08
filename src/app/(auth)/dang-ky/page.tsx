'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return
    }

    setIsLoading(true)
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      username,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    } as any)
    setIsLoading(false)
    
    if (error) {
      toast.error(error.message || 'Đăng ký thất bại')
    } else {
      toast.success('Đăng ký thành công! Đang đăng nhập...')
      router.push('/')
      router.refresh()
    }
  }

  const handleSocialSignIn = async (provider: 'google' | 'facebook') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/'
    })
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass shadow-2xl my-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Đăng ký</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Tạo tài khoản VNDealz của bạn</p>
      </div>

      <div className="space-y-4 mb-6">
        <Button 
          variant="outline" 
          className="w-full h-12 relative bg-white/50 hover:bg-white/80 transition-colors"
          onClick={() => handleSocialSignIn('google')}
        >
          <span className="font-semibold">Đăng ký với Google</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 relative bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/30 transition-colors"
          onClick={() => handleSocialSignIn('facebook')}
        >
          <span className="font-semibold">Đăng ký với Facebook</span>
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--color-surface)] px-2 text-[var(--color-text-muted)]">Hoặc bằng Email</span>
        </div>
      </div>

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập (Username)</Label>
          <Input 
            id="username" 
            placeholder="Ví dụ: deal_hunter_99" 
            required 
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên hiển thị</Label>
          <Input 
            id="name" 
            placeholder="Ví dụ: Nguyễn Văn A" 
            required 
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            required 
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-[var(--color-primary)] text-white hover:opacity-90 mt-6"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng ký'}
        </Button>
      </form>

      <div className="text-center mt-6 text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
        Đã có tài khoản?{' '}
        <Link href="/dang-nhap" className="text-[var(--color-primary)] hover:underline font-semibold">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}
