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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    })
    setIsLoading(false)
    
    if (error) {
      toast.error(error.message || 'Sai email hoặc mật khẩu')
    } else {
      toast.success('Đăng nhập thành công!')
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
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl glass shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Đăng nhập</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Chào mừng bạn trở lại với VNDealz!</p>
      </div>

      <div className="space-y-4 mb-6">
        <Button 
          variant="outline" 
          className="w-full h-12 relative bg-white/50 hover:bg-white/80 transition-colors"
          onClick={() => handleSocialSignIn('google')}
        >
          {/* <img src="/google.svg" alt="Google" className="absolute left-4 w-5 h-5" /> */}
          <span className="font-semibold">Tiếp tục với Google</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-12 relative bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/30 transition-colors"
          onClick={() => handleSocialSignIn('facebook')}
        >
          {/* <img src="/facebook.svg" alt="Facebook" className="absolute left-4 w-5 h-5" /> */}
          <span className="font-semibold">Tiếp tục với Facebook</span>
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

      <form onSubmit={handleEmailSignIn} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mật khẩu</Label>
            {/* <Link href="/quen-mat-khau" className="text-sm text-[var(--color-primary)] hover:underline">Quên mật khẩu?</Link> */}
          </div>
          <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-[var(--color-primary)] text-white hover:opacity-90 mt-6"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Đăng nhập'}
        </Button>
      </form>

      <div className="text-center mt-6 text-[length:var(--font-size-sm)] text-[var(--color-text-muted)]">
        Chưa có tài khoản?{' '}
        <Link href="/dang-ky" className="text-[var(--color-primary)] hover:underline font-semibold">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  )
}
