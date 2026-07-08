import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

export const DealRejectedEmail = ({
  dealTitle,
  userName,
  reason = 'It violates our community guidelines.',
}: {
  dealTitle: string
  userName: string
  reason?: string
}) => (
  <Html>
    <Head />
    <Preview>Update on your deal "{dealTitle}"</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Hi {userName},</Heading>
        <Text style={text}>
          Thank you for submitting <strong>{dealTitle}</strong>. Unfortunately, our moderation team has decided not to approve it at this time.
        </Text>
        <Text style={text}>
          <strong>Reason:</strong> {reason}
        </Text>
        <Text style={text}>
          Please review our posting guidelines before submitting another deal. We appreciate your effort and hope to see more contributions from you!
        </Text>
        <Text style={footer}>
          — The VNDealz Team
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
const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 48px',
  marginTop: '20px',
}

export default DealRejectedEmail
