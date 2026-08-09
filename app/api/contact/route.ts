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
  // Additional aliases used by front-end forms
  specialRequests?: string
  tourName?: string
  dates?: string
  travelers?: string
}

async function sendEmailWithSMTP(to: string, subject: string, html: string) {
  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      html,
    })
    return true
  } catch (err) {
    console.error('SMTP send failed', err)
    return false
  }
}

async function sendEmailWithSendGrid(to: string, subject: string, html: string) {
  try {
    const key = process.env.SENDGRID_API_KEY
    if (!key) return false
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.FROM_EMAIL || 'no-reply@example.com' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    })
    return true
  } catch (err) {
    console.error('SendGrid send failed', err)
    return false
  }
}

async function sendEmailWithResend(to: string, subject: string, html: string) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('Resend API key not found')
      return false
    }
    
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    
    const fromEmail = process.env.FROM_EMAIL || 'noreply@kekeosafaris.com'
    console.log('Resend sending email:', { from: fromEmail, to, subject })
    
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    })
    
    console.log('Resend email sent successfully:', result)
    return true
  } catch (err: any) {
    console.error('Resend send failed:', err)
    console.error('Resend error details:', err?.message, err?.stack)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()

    // Basic validation - accept several possible field names from different forms
    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const message = ((body.message || body.specialRequests || body.tourName) || '').toString().trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields (name, email, message)' }, { status: 400 })
    }

    // Try to save to Supabase (optional - email will still send if this fails)
    let supabaseData = null
    try {
      const supabase = createSupabaseClient()
      const insertPayload = {
        name,
        email,
        phone: body.phone || null,
        subject: body.subject || null,
        message,
        selected_tour: body.selectedTour || body.tourName || null,
        travel_dates: body.travelDates || body.dates || null,
        group_size: body.groupSize || body.travelers || null,
      }

      const { data, error } = await supabase.from('inquiries').insert(insertPayload).select().single()
      
      if (error) {
        console.warn('Supabase insert failed (non-critical):', error)
      } else {
        supabaseData = data
      }
    } catch (err) {
      console.warn('Supabase not configured or insert failed (non-critical):', err)
    }

    // Build email body
    const emailHtml = `
      <p>New enquiry received</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${body.phone || 'N/A'}</li>
        <li><strong>Subject:</strong> ${body.subject || 'N/A'}</li>
        <li><strong>Selected Tour:</strong> ${body.selectedTour || body.tourName || 'N/A'}</li>
        <li><strong>Travel Dates:</strong> ${body.travelDates || body.dates || 'N/A'}</li>
        <li><strong>Group Size:</strong> ${body.groupSize || body.travelers || 'N/A'}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `

    const recipient = process.env.ENQUIRY_RECIPIENT || 'samsuya999@gmail.com'
    let emailSent = false
    const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    const sendgridConfigured = Boolean(process.env.SENDGRID_API_KEY)
    const resendConfigured = Boolean(process.env.RESEND_API_KEY)

    console.log('Email configuration:', {
      recipient,
      resendConfigured,
      smtpConfigured,
      sendgridConfigured,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...'
    })

    // Try Resend first (preferred), then SMTP, then SendGrid
    if (resendConfigured) {
      console.log('Attempting to send email via Resend...')
      emailSent = await sendEmailWithResend(recipient, `New enquiry from ${name}`, emailHtml)
      console.log('Resend email result:', emailSent)
      if (!emailSent) console.error('Resend provider detected but send failed')
    } else if (smtpConfigured) {
      console.log('Attempting to send email via SMTP...')
      emailSent = await sendEmailWithSMTP(recipient, `New enquiry from ${name}`, emailHtml)
      console.log('SMTP email result:', emailSent)
      if (!emailSent) console.error('SMTP provider detected but send failed')
    } else if (sendgridConfigured) {
      console.log('Attempting to send email via SendGrid...')
      emailSent = await sendEmailWithSendGrid(recipient, `New enquiry from ${name}`, emailHtml)
      console.log('SendGrid email result:', emailSent)
      if (!emailSent) console.error('SendGrid provider detected but send failed')
    } else {
      console.warn('No email provider configured; skipping send. Set RESEND_API_KEY, SMTP_*, or SENDGRID_API_KEY env vars to enable email.')
    }

    return NextResponse.json({ 
      success: true, 
      id: supabaseData?.id ?? null, 
      emailSent, 
      resendConfigured,
      smtpConfigured, 
      sendgridConfigured 
    })
  } catch (err: any) {
    console.error('API /api/contact error', err)
    console.error('Error details:', err?.message, err?.stack)
    return NextResponse.json({ 
      error: 'Server error', 
      details: err?.message 
    }, { status: 500 })
  }
}
