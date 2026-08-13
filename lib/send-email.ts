// ─── Shared Cascading Email Engine (Resend → Gmail SMTP → SendGrid) ─────────

export async function sendEmailWithResend(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const fromOptions = [
      'noreply@kekeosafaris.com',
      'Kekeo Safaris <onboarding@resend.dev>',
    ]

    for (const from of fromOptions) {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
      })

      if (!error) {
        console.log(`✅ Resend sent from "${from}" to "${to}" - id: ${data?.id}`)
        return true
      }

      if (
        error.name === 'validation_error' &&
        error.message?.includes('not verified')
      ) {
        console.warn(`Resend: "${from}" not verified, trying next sender...`)
        continue
      }

      console.error('Resend error:', JSON.stringify(error))
      return false
    }

    console.error('Resend: all senders exhausted')
    return false
  } catch (err: any) {
    console.error('Resend exception:', err?.message)
    return false
  }
}

export async function sendEmailWithSMTP(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpHost = process.env.SMTP_HOST

  if (!smtpHost || !smtpUser || !smtpPass) {
    return false
  }

  try {
    const nodemailer = await import('nodemailer')

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: `Kekeo Safaris <${smtpUser}>`,
      to,
      subject,
      html,
    })

    console.log(`✅ Gmail SMTP sent to "${to}" successfully`)
    return true
  } catch (err: any) {
    console.error('SMTP error:', err?.message)
    return false
  }
}

export async function sendEmailWithSendGrid(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) return false

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: {
          email: process.env.FROM_EMAIL || 'noreply@kekeosafaris.com',
          name: 'Kekeo Safaris',
        },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })

    if (!res.ok) {
      console.error('SendGrid HTTP error:', res.status, await res.text())
      return false
    }

    console.log(`✅ SendGrid email sent to "${to}" successfully`)
    return true
  } catch (err: any) {
    console.error('SendGrid error:', err?.message)
    return false
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ sent: boolean; provider: string }> {
  // 1. Resend
  if (process.env.RESEND_API_KEY) {
    const sent = await sendEmailWithResend(to, subject, html)
    if (sent) return { sent: true, provider: 'resend' }
    console.warn('Resend failed - falling back to SMTP...')
  }

  // 2. Gmail SMTP
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    const sent = await sendEmailWithSMTP(to, subject, html)
    if (sent) return { sent: true, provider: 'smtp' }
    console.warn('SMTP failed - falling back to SendGrid...')
  }

  // 3. SendGrid
  if (process.env.SENDGRID_API_KEY) {
    const sent = await sendEmailWithSendGrid(to, subject, html)
    if (sent) return { sent: true, provider: 'sendgrid' }
  }

  console.error('❌ All email providers failed')
  return { sent: false, provider: 'none' }
}
