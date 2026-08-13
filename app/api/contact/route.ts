import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'

type Body = {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  selectedTour?: string
  travelDates?: string
  groupSize?: string
  specialRequests?: string
  tourName?: string
  dates?: string
  travelers?: string
}

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

// ─── Provider 3: SendGrid ────────────────────────────────────────────────────
async function sendEmailWithSendGrid(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const key = process.env.SENDGRID_API_KEY

  if (!key) return false

  try {
    const res = await fetch(
      'https://api.sendgrid.com/v3/mail/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: {
            email:
              process.env.SMTP_USER ||
              'noreply@kekeosafaris.com',
            name: 'Kekeo Safaris',
          },
          subject,
          content: [
            {
              type: 'text/html',
              value: html,
            },
          ],
        }),
      }
    )

    if (!res.ok) {
      console.error(
        'SendGrid HTTP error:',
        res.status,
        await res.text()
      )
      return false
    }

    console.log('SendGrid email sent successfully')
    return true
  } catch (err: any) {
    console.error('SendGrid error:', err?.message)
    return false
  }
}

// ─── Smart sender ────────────────────────────────────────────────────────────
async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ sent: boolean; provider: string }> {
  // 1. Resend
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

  // 2. Gmail SMTP
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

    console.warn(
      'SMTP failed - falling back to SendGrid...'
    )
  }

  // 3. SendGrid
  if (process.env.SENDGRID_API_KEY) {
    const sent = await sendEmailWithSendGrid(
      to,
      subject,
      html
    )

    if (sent) {
      return {
        sent: true,
        provider: 'sendgrid',
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
export async function POST(request: Request) {
  try {
    const body: Body = await request.json()

    const name = (body.name || '').trim()
    const email = (body.email || '').trim()

    const message = (
      body.message ||
      body.specialRequests ||
      body.tourName ||
      ''
    )
      .toString()
      .trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error:
            'Missing required fields (name, email, message)',
        },
        {
          status: 400,
        }
      )
    }

    // ─── Save enquiry to Supabase ────────────────────────────────────────────
    let supabaseData = null

    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase
        .from('inquiries')
        .insert({
          name,
          email,
          phone: body.phone || null,
          subject: body.subject || null,
          message,
          selected_tour:
            body.selectedTour ||
            body.tourName ||
            null,
          travel_dates:
            body.travelDates ||
            body.dates ||
            null,
          group_size:
            body.groupSize ||
            body.travelers ||
            null,
        })
        .select()
        .single()

      if (error) {
        console.warn(
          'Supabase insert failed (non-critical):',
          error
        )
      } else {
        supabaseData = data
      }
    } catch (err) {
      console.warn(
        'Supabase not configured (non-critical):',
        err
      )
    }

    // ─── Build notification email ────────────────────────────────────────────
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
          📬 New Enquiry — Kekeo Safaris
        </h2>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
          "
        >

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Name
            </td>
            <td style="padding: 8px;">
              ${name}
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Email
            </td>
            <td style="padding: 8px;">
              <a href="mailto:${email}">
                ${email}
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Phone
            </td>
            <td style="padding: 8px;">
              ${body.phone || 'N/A'}
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Subject
            </td>
            <td style="padding: 8px;">
              ${body.subject || 'N/A'}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Tour
            </td>
            <td style="padding: 8px;">
              ${body.selectedTour || body.tourName || 'N/A'}
            </td>
          </tr>

          <tr style="background:#f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Travel Dates
            </td>
            <td style="padding: 8px;">
              ${body.travelDates || body.dates || 'N/A'}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">
              Group Size
            </td>
            <td style="padding: 8px;">
              ${body.groupSize || body.travelers || 'N/A'}
            </td>
          </tr>

        </table>

        <h3
          style="
            color: #2d6a4f;
            margin-top: 20px;
          "
        >
          Message
        </h3>

        <p
          style="
            background: #f0f7f4;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2d6a4f;
          "
        >
          ${message.replace(/\n/g, '<br/>')}
        </p>

        <p
          style="
            color: #999;
            font-size: 12px;
            margin-top: 30px;
          "
        >
          Sent via Kekeo Safaris contact form —
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
      `New Enquiry from ${name}`,
      emailHtml
    )

    console.log(
      `Email result: sent=${emailSent}, provider=${provider}`
    )

    return NextResponse.json({
      success: true,
      id: supabaseData?.id ?? null,
      emailSent,
      provider,
    })
  } catch (err: any) {
    console.error(
      'POST /api/contact error:',
      err?.message
    )

    return NextResponse.json(
      {
        error: 'Server error',
        details: err?.message,
      },
      {
        status: 500,
      }
    )
  }
}