import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface InviteEmailProps {
  restaurantName: string
  inviteUrl: string
  siteUrl: string
}

export function InviteEmail({ restaurantName, inviteUrl, siteUrl }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re approved — your OrderPilot dashboard is ready</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>⚡ OrderPilot</Text>
          </Section>

          {/* Main card */}
          <Section style={card}>
            <Text style={tag}>You&apos;re approved</Text>
            <Text style={heading}>
              Welcome to OrderPilot,{'\n'}{restaurantName}
            </Text>
            <Text style={paragraph}>
              Your kitchen dashboard is set up and ready to go. Every order from Uber Eats,
              Deliveroo, Just Eat, and your direct channel — all in one live view.
            </Text>
            <Text style={paragraph}>
              Click the button below to access your dashboard and set your password.
              The link expires in 24 hours.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteUrl}>
                Access your dashboard →
              </Button>
            </Section>

            <Text style={hint}>
              Button not working? Copy and paste this link into your browser:{' '}
              <Link href={inviteUrl} style={linkStyle}>
                {inviteUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Referral section */}
          <Section style={referralSection}>
            <Text style={referralHeading}>Know another restaurant that needs this?</Text>
            <Text style={referralText}>
              If you know a restaurant owner struggling with delivery chaos, send them our way.
              We&apos;ll onboard them personally, just like we did with you.
            </Text>
            <Link href={`${siteUrl}/waitlist`} style={referralLink}>
              Share OrderPilot →
            </Link>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section>
            <Text style={footer}>
              OrderPilot · Built for restaurants that move fast
            </Text>
            <Text style={footer}>
              Questions? Reply to this email and we&apos;ll get back to you within a few hours.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: 0,
  padding: '40px 0',
}

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
}

const header: React.CSSProperties = {
  backgroundColor: '#09090b',
  borderRadius: '12px 12px 0 0',
  padding: '24px 32px',
}

const logo: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  margin: 0,
  letterSpacing: '-0.3px',
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  padding: '32px',
}

const tag: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#eef2ff',
  color: '#6366f1',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  padding: '4px 10px',
  borderRadius: '999px',
  marginBottom: '16px',
  marginTop: 0,
}

const heading: React.CSSProperties = {
  color: '#09090b',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 16px',
  whiteSpace: 'pre-line',
}

const paragraph: React.CSSProperties = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const buttonContainer: React.CSSProperties = {
  margin: '28px 0 24px',
}

const button: React.CSSProperties = {
  backgroundColor: '#6366f1',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}

const hint: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
  wordBreak: 'break-all',
}

const linkStyle: React.CSSProperties = {
  color: '#6366f1',
  textDecoration: 'underline',
}

const divider: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '0',
}

const referralSection: React.CSSProperties = {
  backgroundColor: '#fafafa',
  padding: '24px 32px',
}

const referralHeading: React.CSSProperties = {
  color: '#18181b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const referralText: React.CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 12px',
}

const referralLink: React.CSSProperties = {
  color: '#6366f1',
  fontSize: '13px',
  fontWeight: '600',
  textDecoration: 'none',
}

const footer: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '16px 32px 4px',
  textAlign: 'center',
}
