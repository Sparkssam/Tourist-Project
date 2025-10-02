import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, location, tour, rating, review } = body

    // Here you would typically save the review to a database
    // and optionally send a notification email

    console.log("Review submission:", {
      name,
      email,
      location,
      tour,
      rating,
      review,
      timestamp: new Date().toISOString(),
      status: "pending_moderation",
    })

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send notification email to admin
    // 3. Optionally send confirmation email to reviewer

    return NextResponse.json({ message: "Review submitted successfully and is pending moderation" }, { status: 200 })
  } catch (error) {
    console.error("Error processing review submission:", error)
    return NextResponse.json({ error: "Failed to process review submission" }, { status: 500 })
  }
}
