// (auth) layout — centered card with glass effect, no navbar/sidebar
// TODO: Junior — add logo, background gradient, glass card styling

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)' }}
    >
      <div className="w-full max-w-md glass-strong rounded-[var(--border-radius-xl)] p-8 page-enter">
        {children}
      </div>
    </div>
  )
}
