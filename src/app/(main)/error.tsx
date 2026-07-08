'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi hệ thống!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Xin lỗi, đã có lỗi không mong muốn xảy ra. Chúng tôi đã ghi nhận sự cố này.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Thử lại
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Về Trang chủ
        </Button>
      </div>
    </div>
  )
}
