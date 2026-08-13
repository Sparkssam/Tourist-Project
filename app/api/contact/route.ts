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
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; color: #333; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #1a3d2b, #2d6a4f); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">🦁 New Safari Enquiry</h1>
          <p style="color: #d4c8aa; margin: 6px 0 0 0; font-size: 14px;">Kekeo Safaris Booking Request</p>
        </div>

        <div style="background: #ffffff; padding: 28px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e9ecef; border-top: none;">

          <h3 style="color: #2d6a4f; border-bottom: 2px solid #e2d8c3; padding-bottom: 8px; margin-top: 0;">👤 Personal Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 10px; font-weight: 600; color: #555; width: 35%; border-bottom: 1px solid #eee;">Full Name:</td><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 700; color: #1a3d2b;">${name}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Email Address:</td><td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #2d6a4f; text-decoration: none; font-weight: 600;">${email}</a></td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Phone / WhatsApp:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.phone || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Country of Residence:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.country || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Nationality:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.nationality || 'Not specified'}</td></tr>
          </table>

          <h3 style="color: #2d6a4f; border-bottom: 2px solid #e2d8c3; padding-bottom: 8px; margin-top: 20px;">🌍 Safari & Travel Specifications</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr><td style="padding: 10px; font-weight: 600; color: #555; width: 35%; border-bottom: 1px solid #eee;">Safari / Tour Type:</td><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600; color: #a67c52;">${body.selectedTour || body.tourTypes || body.tourName || 'General Enquiry'}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Exact Dates / Range:</td><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: 600;">${body.travelDates || (body.travelDateFrom ? `${body.travelDateFrom} to ${body.travelDateTo || 'Open'}` : 'Not specified')}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Date Flexibility:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.flexibility || 'Flexible'}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Group Size:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.groupSize || (body.adults ? `${body.adults} Adults, ${body.children || 0} Children` : 'Not specified')}</td></tr>
            ${body.childrenAges ? `<tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Children Ages:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.childrenAges}</td></tr>` : ''}
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Accommodation Tier:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.accommodation || body.accommodationStyle || 'Not specified'}</td></tr>
            <tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Budget Range:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.budget || 'Flexible'}</td></tr>
            ${body.interests ? `<tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Special Interests:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.interests}</td></tr>` : ''}
          </table>

          ${(body.dietary || body.specialOccasion) ? `
          <h3 style="color: #2d6a4f; border-bottom: 2px solid #e2d8c3; padding-bottom: 8px; margin-top: 20px;">✨ Special Requirements</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            ${body.dietary ? `<tr><td style="padding: 10px; font-weight: 600; color: #555; width: 35%; border-bottom: 1px solid #eee;">Dietary Requirements:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.dietary}</td></tr>` : ''}
            ${body.specialOccasion ? `<tr><td style="padding: 10px; font-weight: 600; color: #555; border-bottom: 1px solid #eee;">Special Occasion:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${body.specialOccasion}</td></tr>` : ''}
          </table>
          ` : ''}

          <h3 style="color: #2d6a4f; border-bottom: 2px solid #e2d8c3; padding-bottom: 8px; margin-top: 20px;">💬 Message / Additional Notes</h3>
          <div style="background: #f4f6f5; padding: 16px; border-radius: 8px; border-left: 4px solid #2d6a4f; font-size: 14px; line-height: 1.6; color: #2d3748;">
            ${message.replace(/\n/g, '<br/>')}
          </div>

          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
            Sent automatically via Kekeo Safaris Enquiry Engine — ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} EAT
          </div>
        </div>
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