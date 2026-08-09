import { type NextRequest, NextResponse } from "next/server"

async function sendEmailWithResend(to: string, subject: string, html: string) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return false
    
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@kekeosafaris.com',
      to,
      subject,
      html,
    })
    
    console.log('Resend email sent:', result)
    return true
  } catch (err) {
    console.error('Resend send failed', err)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, tourName, preferredDate, groupSize, budget, specialRequests } = body

    console.log("Tour inquiry submission:", {
      name,
      email,
      phone,
      tourName,
      preferredDate,
      groupSize,
      budget,
      specialRequests,
      timestamp: new Date().toISOString(),
    })

    // Build email body
    const emailHtml = `
      <h2>New Tour Inquiry</h2>
      <ul>
        <li><strong>Tour:</strong> ${tourName || 'N/A'}</li>
        <li><strong>Name:</strong> ${name || 'N/A'}</li>
        <li><strong>Email:</strong> ${email || 'N/A'}</li>
        <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
        <li><strong>Preferred Date:</strong> ${preferredDate || 'N/A'}</li>
        <li><strong>Group Size:</strong> ${groupSize || 'N/A'}</li>
        <li><strong>Budget:</strong> ${budget || 'N/A'}</li>
      </ul>
      <p><strong>Special Requests:</strong></p>
      <p>${(specialRequests || 'None').replace(/\n/g, '<br/>')}</p>
    `

    const recipient = process.env.ENQUIRY_RECIPIENT || 'samsuya999@gmail.com'
    const resendConfigured = Boolean(process.env.RESEND_API_KEY)

    let emailSent = false
    if (resendConfigured) {
      emailSent = await sendEmailWithResend(recipient, `New Tour Inquiry: ${tourName || 'General'}`, emailHtml)
      if (!emailSent) console.error('Resend provider detected but send failed')
    } else {
      console.warn('No email provider configured; skipping send. Set RESEND_API_KEY env var to enable email.')
    }

    return NextResponse.json({ 
      message: "Tour inquiry submitted successfully",
      emailSent 
    }, { status: 200 })
  } catch (error) {
    console.error("Error processing tour inquiry:", error)
    return NextResponse.json({ error: "Failed to process tour inquiry" }, { status: 500 })
  }
}
