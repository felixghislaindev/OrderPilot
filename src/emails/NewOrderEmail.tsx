import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface OrderItem {
  name:     string
  quantity: number
  price:    number  // pence
}

interface NewOrderEmailProps {
  restaurantName:  string
  displayId:       string
  customerName:    string
  customerPhone?:  string | null
  items:           OrderItem[]
  total:           number  // pence
  deliveryAddress: string | null
  notes:           string | null
  dashboardUrl:    string
}

function pence(n: number) {
  return `£${(n / 100).toFixed(2)}`
}

export function NewOrderEmail({
  restaurantName,
  displayId,
  customerName,
  customerPhone,
  items,
  total,
  deliveryAddress,
  notes,
  dashboardUrl,
}: NewOrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New order #{displayId} from {customerName} — {pence(total)}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>⚡ OrderPilot</Text>
          </Section>

          {/* Main card */}
          <Section style={card}>
            <Text style={tag}>New order</Text>
            <Text style={heading}>#{displayId} · {pence(total)}</Text>
            <Text style={subheading}>{restaurantName}</Text>

            {/* Customer */}
            <Section style={metaBlock}>
              <Text style={metaLabel}>Customer</Text>
              <Text style={metaValue}>
                {customerName}{customerPhone ? ` · ${customerPhone}` : ''}
              </Text>
            </Section>

            {/* Items */}
            <Section style={metaBlock}>
              <Text style={metaLabel}>Items</Text>
              {items.map((item, i) => (
                <Text key={i} style={itemRow}>
                  {item.quantity}× {item.name}
                  <span style={itemPrice}> — {pence(item.price * item.quantity)}</span>
                </Text>
              ))}
            </Section>

            {/* Delivery address */}
            {deliveryAddress && (
              <Section style={metaBlock}>
                <Text style={metaLabel}>Deliver to</Text>
                <Text style={metaValue}>{deliveryAddress}</Text>
              </Section>
            )}

            {/* Notes */}
            {notes && (
              <Section style={metaBlock}>
                <Text style={metaLabel}>Notes</Text>
                <Text style={metaValue}>{notes}</Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Open dashboard →
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section>
            <Text style={footer}>OrderPilot · Built for restaurants that move fast</Text>
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
  margin: '0 0 4px',
}

const subheading: React.CSSProperties = {
  color: '#71717a',
  fontSize: '14px',
  margin: '0 0 24px',
}

const metaBlock: React.CSSProperties = {
  marginBottom: '16px',
}

const metaLabel: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  margin: '0 0 4px',
}

const metaValue: React.CSSProperties = {
  color: '#18181b',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: 0,
}

const itemRow: React.CSSProperties = {
  color: '#18181b',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 2px',
}

const itemPrice: React.CSSProperties = {
  color: '#71717a',
}

const buttonContainer: React.CSSProperties = {
  margin: '28px 0 0',
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

const divider: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '0',
}

const footer: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '16px 32px',
  textAlign: 'center',
}
