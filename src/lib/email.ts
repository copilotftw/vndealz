import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
export const resend = apiKey ? new Resend(apiKey) : null

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent:')
    console.warn(`To: ${to}\nSubject: ${subject}`)
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'VNDealz <noreply@vndealz.vn>', // Replace with your verified domain
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send email:', error)
    }
    return data
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
