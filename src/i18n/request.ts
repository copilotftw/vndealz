import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  let locale = cookieStore.get('NEXT_LOCALE')?.value
  
  if (!locale) {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || ''
    locale = acceptLanguage.toLowerCase().includes('en') ? 'en' : 'vi'
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
