'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface PriceChartProps {
  data: {
    price: number
    createdAt: Date
  }[]
}

export function PriceChart({ data }: PriceChartProps) {
  if (!data || data.length === 0) return null

  // Format data for Recharts
  const chartData = data.map((d) => ({
    price: Number(d.price),
    date: format(new Date(d.createdAt), 'MMM dd, yyyy'),
    timestamp: new Date(d.createdAt).getTime(),
  }))

  return (
    <div className="w-full h-[300px] mt-8 bg-[var(--color-surface)]/50 glass-subtle p-4 rounded-xl">
      <h3 className="text-[length:var(--font-size-lg)] font-bold mb-4 text-[var(--color-text)]">Price History</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="var(--color-text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--color-text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `₫${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }} 
            formatter={(value: any) => [
              new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value)), 
              'Price'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="var(--color-primary)" 
            strokeWidth={3} 
            dot={{ fill: 'var(--color-primary)', r: 4 }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
