import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'react-email'

export const DealAlertEmail = ({
  keyword,
  dealTitle,
  dealUrl,
  price,
  userName,
}: {
  keyword: string
  dealTitle: string
  dealUrl: string
  price: number
  userName: string
}) => (
  <Html>
    <Head />
    <Preview>New deal alert for "{keyword}"!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hi {userName},</Heading>
        <Text style={text}>
          A new deal matching your alert for <strong>"{keyword}"</strong> has just been posted!
        </Text>
        <Text style={text}>
          <strong>{dealTitle}</strong> - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </Text>
        <Text style={text}>
          <Link href={dealUrl} style={button}>
            View Deal
          </Link>
        </Text>
        <Text style={footer}>
          You are receiving this because you set up a Deal Alert on VNDealz.
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}
const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}
const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 48px',
}
const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
}
const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  lineHeight: '50px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
}
const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '20px',
}

export default DealAlertEmail
