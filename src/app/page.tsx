// Root page — redirect to /vi/ (default locale)
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/vi')
}
