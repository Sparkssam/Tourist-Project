import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, tourInterest } = body

    // Here you would typically send an email using a service like:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // For now, we'll just log the submission

    console.log("Contact form submission:", {
      name,
      email,
      phone,
      subject,
      message,
      tourInterest,
      timestamp: new Date().toISOString(),
    })

    // In a real implementation, you would send an email to samsuya999@gmail.com
    // Example with a hypothetical email service:
    /*
    await emailService.send({
      to: 'samsuya999@gmail.com',
      from: 'noreply@kekeosafaris.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Tour Interest:</strong> ${tourInterest}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
    */

    return NextResponse.json({ message: "Contact form submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ error: "Failed to process contact form submission" }, { status: 500 })
  }
}
