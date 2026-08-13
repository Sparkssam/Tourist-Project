import { type NextRequest, NextResponse } from 'next/server'

// ─── Provider 1: Resend ──────────────────────────────────────────────────────
async function sendEmailWithResend(
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
        console.log(`Resend sent from "${from}" - id: ${data?.id}`)
        return true
      }

      if (
        error.name === 'validation_error' &&
        error.message?.includes('not verified')
      ) {
        console.warn(
          `Resend: "${from}" not verified, trying next sender...`
        )
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

// ─── Provider 2: Gmail SMTP ──────────────────────────────────────────────────
async function sendEmailWithSMTP(
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

    console.log('SMTP (Gmail) email sent successfully')
    return true
  } catch (err: any) {
    console.error('SMTP error:', err?.message)
    return false
  }
}

// ─── Smart sender ────────────────────────────────────────────────────────────
async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ sent: boolean; provider: string }> {
  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    const sent = await sendEmailWithResend(
      to,
      subject,
      html
    )

    if (sent) {
      return {
        sent: true,
        provider: 'resend',
      }
    }

    console.warn(
      'Resend failed - falling back to SMTP...'
    )
  }

  // Try Gmail SMTP second
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    const sent = await sendEmailWithSMTP(
      to,
      subject,
      html
    )

    if (sent) {
      return {
        sent: true,
        provider: 'smtp',
      }
    }
  }

  console.error('All email providers failed')

  return {
    sent: false,
    provider: 'none',
  }
}

// ─── POST handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      tourName,
      preferredDate,
      groupSize,
      budget,
      specialRequests,
    } = body

    console.log('Tour inquiry received:', {
      name,
      email,
      tourName,
      preferredDate,
      groupSize,
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body
        style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        "
      >

        <h2
          style="
            color: #2d6a4f;
            border-bottom: 2px solid #2d6a4f;
            padding-bottom: 10px;
          "
        >
          🦁 New Tour Inquiry — Kekeo Safaris
        </h2>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
          "
        >

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Tour
            </td>
            <td style="padding: 8px;">
              ${tourName || 'N/A'}
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Name
            </td>
            <td style="padding: 8px;">
              ${name || 'N/A'}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Email
            </td>
            <td style="padding: 8px;">
              <a href="mailto:${email}">
                ${email || 'N/A'}
              </a>
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Phone
            </td>
            <td style="padding: 8px;">
              ${phone || 'N/A'}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Preferred Date
            </td>
            <td style="padding: 8px;">
              ${preferredDate || 'N/A'}
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Group Size
            </td>
            <td style="padding: 8px;">
              ${groupSize || 'N/A'}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Budget
            </td>
            <td style="padding: 8px;">
              ${budget || 'N/A'}
            </td>
          </tr>

        </table>

        ${
          specialRequests
            ? `
        <h3
          style="
            color: #2d6a4f;
            margin-top: 20px;
          "
        >
          Special Requests
        </h3>

        <p
          style="
            background: #f0f7f4;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2d6a4f;
          "
        >
          ${String(specialRequests).replace(/\n/g, '<br/>')}
        </p>
        `
            : ''
        }

        <p
          style="
            color: #999;
            font-size: 12px;
            margin-top: 30px;
          "
        >
          Sent via Kekeo Safaris tour inquiry form —
          ${new Date().toLocaleString('en-GB', {
            timeZone: 'Africa/Nairobi',
          })}
          EAT
        </p>

      </body>
      </html>
    `

    const recipient =
      process.env.ENQUIRY_RECIPIENT ||
      'doubleebariki@gmail.com'

    const {
      sent: emailSent,
      provider,
    } = await sendEmail(
      recipient,
      `New Tour Inquiry: ${tourName || 'General'} — from ${
        name || 'Unknown'
      }`,
      emailHtml
    )

    console.log(
      `Email result: sent=${emailSent}, provider=${provider}`
    )

    return NextResponse.json(
      {
        message:
          'Tour inquiry submitted successfully',
        emailSent,
        provider,
      },
      {
        status: 200,
      }
    )
  } catch (error: any) {
    console.error(
      'POST /api/tour-inquiry error:',
      error?.message
    )

    return NextResponse.json(
      {
        error:
          'Failed to process tour inquiry',
      },
      {
        status: 500,
      }
    )
  }
}