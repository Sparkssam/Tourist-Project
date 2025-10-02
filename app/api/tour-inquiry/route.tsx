import { type NextRequest, NextResponse } from "next/server"

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

    // In a real implementation, send email to samsuya999@gmail.com
    /*
    await emailService.send({
      to: 'samsuya999@gmail.com',
      from: 'noreply@kekeosafaris.com',
      subject: `New Tour Inquiry: ${tourName}`,
      html: `
        <h2>New Tour Inquiry</h2>
        <p><strong>Tour:</strong> ${tourName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Date:</strong> ${preferredDate}</p>
        <p><strong>Group Size:</strong> ${groupSize}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Special Requests:</strong></p>
        <p>${specialRequests}</p>
      `
    })
    */

    return NextResponse.json({ message: "Tour inquiry submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error processing tour inquiry:", error)
    return NextResponse.json({ error: "Failed to process tour inquiry" }, { status: 500 })
  }
}
