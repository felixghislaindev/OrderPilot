import {
  Body, Button, Container, Head, Hr, Html, Link, Preview, Section, Text,
} from '@react-email/components'

interface ResetEmailProps {
  resetUrl: string
}

export function ResetEmail({ resetUrl }: ResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your OrderPilot password</Preview>
      <Body style={body}>
        <Container style={container}>

          <Section style={header}>
            <Text style={logo}>⚡ OrderPilot</Text>
          </Section>

          <Section style={card}>
            <Text style={tag}>Password reset</Text>
            <Text style={heading}>Reset your password</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your OrderPilot account.
              Click the button below to choose a new one. This link expires in 1 hour.
            </Text>
            <Text style={paragraph}>
              If you didn&apos;t request this, you can safely ignore this email — your password won&apos;t change.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Reset my password →
              </Button>
            </Section>

            <Text style={hint}>
              Button not working? Copy and paste this link:{' '}
              <Link href={resetUrl} style={linkStyle}>{resetUrl}</Link>
            </Text>
          </Section>

          <Hr style={divider} />

          <Section>
            <Text style={footer}>OrderPilot · Built for restaurants that move fast</Text>
            <Text style={footer}>Questions? Reply to this email and we&apos;ll get back to you.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: 0, padding: '40px 0',
}
const container: React.CSSProperties = { maxWidth: '520px', margin: '0 auto' }
const header: React.CSSProperties = { backgroundColor: '#09090b', borderRadius: '12px 12px 0 0', padding: '24px 32px' }
const logo: React.CSSProperties = { color: '#ffffff', fontSize: '16px', fontWeight: '700', margin: 0 }
const card: React.CSSProperties = { backgroundColor: '#ffffff', padding: '32px' }
const tag: React.CSSProperties = {
  display: 'inline-block', backgroundColor: '#eef2ff', color: '#6366f1',
  fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase',
  padding: '4px 10px', borderRadius: '999px', marginBottom: '16px', marginTop: 0,
}
const heading: React.CSSProperties = { color: '#09090b', fontSize: '24px', fontWeight: '700', lineHeight: '1.3', margin: '0 0 16px' }
const paragraph: React.CSSProperties = { color: '#52525b', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }
const buttonContainer: React.CSSProperties = { margin: '28px 0 24px' }
const button: React.CSSProperties = {
  backgroundColor: '#6366f1', borderRadius: '10px', color: '#ffffff',
  fontSize: '15px', fontWeight: '600', padding: '14px 28px', textDecoration: 'none', display: 'inline-block',
}
const hint: React.CSSProperties = { color: '#a1a1aa', fontSize: '12px', lineHeight: '1.5', margin: '0', wordBreak: 'break-all' }
const linkStyle: React.CSSProperties = { color: '#6366f1', textDecoration: 'underline' }
const divider: React.CSSProperties = { borderColor: '#e4e4e7', margin: '0' }
const footer: React.CSSProperties = { color: '#a1a1aa', fontSize: '12px', lineHeight: '1.6', margin: '16px 32px 4px', textAlign: 'center' }
