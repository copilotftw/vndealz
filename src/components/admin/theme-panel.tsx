'use client'

import { useState, useTransition } from 'react'
import { updateSiteConfig } from '@/server/actions/theme'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Palette, MonitorSmartphone, Type } from 'lucide-react'

const LAYOUTS = [
  { id: 'modern', name: 'Modern', desc: 'Giao diện hiện đại, bo tròn' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Tối giản, gọn gàng' },
  { id: 'mydealz', name: 'MyDealz', desc: 'Cổ điển, dạng danh sách' },
  { id: 'aliexpress', name: 'AliExpress', desc: 'Lưới 4 cột, ảnh vuông' },
  { id: 'shopee', name: 'Shopee', desc: 'Lưới 5 cột, mật độ cao' },
]

const SCALES = ['xs', 'sm', 'md', 'lg', 'xl']

const COLORS = [
  { id: 'default', name: 'Mặc định (Cam/Vàng)' },
  { id: 'ocean', name: 'Đại dương (Xanh dương)' },
  { id: 'forest', name: 'Rừng (Xanh lá)' },
  { id: 'midnight', name: 'Đêm (Tối)' },
  { id: 'tet', name: 'Tết (Đỏ/Vàng)' },
  { id: 'rose', name: 'Hoa hồng (Hồng/Đỏ)' },
]

export function ThemePanel({ initialConfig }: { initialConfig: any }) {
  const [config, setConfig] = useState(initialConfig || { layout: 'modern', scale: 'md', colorScheme: 'default', customCss: '' })
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSiteConfig(config)
        toast.success('Đã cập nhật giao diện thành công!')
      } catch (err: any) {
        toast.error(err.message || 'Lỗi khi cập nhật giao diện')
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Layout Selection */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MonitorSmartphone className="w-5 h-5 text-primary" />
          Bố cục (Layout)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LAYOUTS.map(layout => (
            <div 
              key={layout.id}
              onClick={() => setConfig({ ...config, layout: layout.id })}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                config.layout === layout.id 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <h3 className="font-semibold">{layout.name}</h3>
              <p className="text-sm text-muted-foreground">{layout.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scale Selection */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          Kích thước (Scale)
        </h2>
        <div className="flex flex-wrap gap-4">
          {SCALES.map(scale => (
            <Button
              key={scale}
              variant={config.scale === scale ? 'default' : 'outline'}
              onClick={() => setConfig({ ...config, scale })}
              className={`w-16 ${config.scale === scale ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              {scale.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Màu sắc (Color Scheme)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COLORS.map(color => (
            <div 
              key={color.id}
              onClick={() => setConfig({ ...config, colorScheme: color.id })}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 flex items-center gap-3 ${
                config.colorScheme === color.id 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-transparent bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary border border-border shadow-sm"></div>
              <span className="font-medium text-sm">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="glass-strong p-6 rounded-xl border border-border">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          &lt;/&gt; CSS Tuỳ chỉnh
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Nhập mã CSS nếu bạn muốn ghi đè các biến hệ thống.</p>
        <Textarea 
          value={config.customCss || ''} 
          onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
          placeholder=":root { --color-primary: #ff0000; }"
          className="font-mono text-sm bg-muted/50"
          rows={6}
        />
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSave} 
          disabled={isPending}
          className="shadow-xl"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Lưu cấu hình giao diện
        </Button>
      </div>
    </div>
  )
}
