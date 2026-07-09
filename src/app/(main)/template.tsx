export default function MainTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="ios-page-enter">
      {children}
    </div>
  )
}
