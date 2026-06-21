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

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()

    // Basic validation
    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const message = (body.message || '').trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    const insertPayload = {
      name,
      email,
      phone: body.phone || null,
      subject: body.subject || null,
      message,
      selected_tour: body.selectedTour || null,
      travel_dates: body.travelDates || null,
      group_size: body.groupSize || null,
    }

    const { data, error } = await supabase.from('inquiries').insert(insertPayload).select().single()

    if (error) {
      console.error('Supabase insert error', error)
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
    }

    // Build email body
    const emailHtml = `
      <p>New enquiry received</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${body.phone || 'N/A'}</li>
        <li><strong>Subject:</strong> ${body.subject || 'N/A'}</li>
        <li><strong>Selected Tour:</strong> ${body.selectedTour || 'N/A'}</li>
        <li><strong>Travel Dates:</strong> ${body.travelDates || 'N/A'}</li>
        <li><strong>Group Size:</strong> ${body.groupSize || 'N/A'}</li>
      </ul>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `

    const recipient = process.env.ENQUIRY_RECIPIENT || 'samsuya999@gmail.com'
    let emailSent = false

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      emailSent = await sendEmailWithSMTP(recipient, `New enquiry from ${name}`, emailHtml)
    } else if (process.env.SENDGRID_API_KEY) {
      emailSent = await sendEmailWithSendGrid(recipient, `New enquiry from ${name}`, emailHtml)
    } else {
      console.warn('No email provider configured; skipping send. Set SMTP_* or SENDGRID_API_KEY env vars to enable email.')
    }

    return NextResponse.json({ success: true, id: data?.id ?? null, emailSent })
  } catch (err) {
    console.error('API /api/contact error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
