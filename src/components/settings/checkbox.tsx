import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface SettingsCheckboxProps {
  id: string
  name: string
  label: string
  description?: string
  defaultChecked?: boolean
}

export function SettingsCheckbox({ id, name, label, description, defaultChecked }: SettingsCheckboxProps) {
  return (
    <div className="flex items-start gap-4">
      <Checkbox 
        id={id} 
        name={name}
        defaultChecked={defaultChecked} 
        className="mt-1 h-5 w-5 rounded-full border-white/20 data-[state=checked]:bg-[var(--color-primary)] data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:text-white"
      />
      <div className="space-y-1">
        <Label htmlFor={id} className="text-sm font-semibold cursor-pointer text-white">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-[500px]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
