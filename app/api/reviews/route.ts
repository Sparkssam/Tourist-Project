import { type NextRequest, NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/send-email"

export async function GET() {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("Supabase fetch reviews warning:", error.message)
      return NextResponse.json({ success: true, reviews: [] })
    }

    return NextResponse.json({ success: true, reviews: data || [] })
  } catch (err: any) {
    console.error("GET /api/reviews error:", err?.message)
    return NextResponse.json({ success: true, reviews: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, location, tour, rating, review } = body

    if (!name || !email || !review || !rating) {
      return NextResponse.json(
        { error: "Name, email, rating, and review text are required fields." },
        { status: 400 }
      )
    }

    const trimmedName = String(name).trim()
    const trimmedEmail = String(email).trim()
    const trimmedLocation = location ? String(location).trim() : null
    const trimmedTour = tour ? String(tour).trim() : null
    const numRating = Number(rating) || 5
    const trimmedReview = String(review).trim()

    // 1️⃣ Save review to Supabase
    let supabaseData = null
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          name: trimmedName,
          email: trimmedEmail,
          location: trimmedLocation,
          tour: trimmedTour,
          rating: numRating,
          review: trimmedReview,
          status: "approved", // Published live to website
        })
        .select()
        .single()

      if (error) {
        console.warn("Supabase review insert warning:", error.message)
      } else {
        supabaseData = data
      }
    } catch (dbErr: any) {
      console.warn("Supabase review exception:", dbErr?.message)
    }

    // 2️⃣ Send Notification Email directly to Owner (doubleebariki@gmail.com) via Resend
    const ownerRecipient = process.env.ENQUIRY_RECIPIENT || "doubleebariki@gmail.com"
    const stars = "⭐".repeat(numRating)

    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; color: #333; background-color: #f4f6f8;">
        <div style="background-color: #1a3d2b; padding: 28px; text-align: center; border-radius: 8px 8px 0 0; border-bottom: 4px solid #a67c52;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">🦁 New Website Review Received</h2>
          <p style="color: #e2d8c3; margin: 6px 0 0 0; font-size: 14px;">Kekeo Safaris — Voices Page Feedback</p>
        </div>
        <div style="background-color: #ffffff; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <h3 style="color: #1a3d2b; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Guest Feedback Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 10px 0; font-weight: bold; color: #555; width: 30%;">Rating:</td><td style="padding: 10px 0; font-size: 18px; font-weight: bold; color: #d97706;">${stars} (${numRating}/5)</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Guest Name:</td><td style="padding: 10px 0; font-weight: 600;">${trimmedName}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Guest Email:</td><td style="padding: 10px 0;"><a href="mailto:${trimmedEmail}" style="color: #1a3d2b; font-weight: 600;">${trimmedEmail}</a></td></tr>
            ${trimmedLocation ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td><td style="padding: 10px 0;">${trimmedLocation}</td></tr>` : ""}
            ${trimmedTour ? `<tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Tour Taken:</td><td style="padding: 10px 0; font-weight: 600; color: #a67c52;">${trimmedTour}</td></tr>` : ""}
            <tr><td style="padding: 10px 0; font-weight: bold; color: #555;">Submitted At:</td><td style="padding: 10px 0;">${new Date().toLocaleString("en-GB", { timeZone: "Africa/Nairobi" })} EAT</td></tr>
          </table>
          
          <div style="background-color: #fdfbf7; border-left: 4px solid #a67c52; padding: 18px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #2d3748; font-style: italic;">
              "${trimmedReview}"
            </p>
          </div>
        </div>
        <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #718096;">
          <p style="margin: 0;">Kekeo Safaris Tanzania • Arusha, Tanzania • doubleebariki@gmail.com</p>
        </div>
      </body>
      </html>
    `

    // Send to owner via Resend engine
    const ownerEmailResult = await sendEmail(
      ownerRecipient,
      `New Website Review (${numRating}/5 Stars) from ${trimmedName}`,
      ownerEmailHtml
    )

    // 3️⃣ Send Thank You Confirmation Email to Tourist
    const touristConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #f9f9f9;">
        <div style="background-color: #1a3d2b; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; border-bottom: 4px solid #a67c52;">
          <h2 style="color: #ffffff; margin: 0;">Asante Sana, ${trimmedName}!</h2>
          <p style="color: #e2d8c3; margin: 4px 0 0 0;">Kekeo Safaris Tanzania</p>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
          <p style="font-size: 15px; line-height: 1.6; color: #333;">
            Thank you for sharing your safari experience with <strong>Kekeo Safaris</strong>! We have received your review and it has been published to our website.
          </p>
          <div style="background-color: #f7fafc; border-left: 4px solid #1a3d2b; padding: 14px; margin: 16px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: bold; color: #1a3d2b;">Your Submitted Review (${numRating}/5 Stars):</p>
            <p style="margin: 6px 0 0 0; font-style: italic; color: #555;">"${trimmedReview}"</p>
          </div>
          <p style="font-size: 14px; color: #666;">
            We hope to welcome you back to Tanzania again soon!
          </p>
          <p style="margin-top: 20px; font-size: 14px; font-weight: bold; color: #1a3d2b;">
            Warm regards,<br>
            The Kekeo Safaris Team<br>
            Arusha, Tanzania
          </p>
        </div>
      </body>
      </html>
    `

    await sendEmail(
      trimmedEmail,
      `Thank you for reviewing Kekeo Safaris, ${trimmedName}!`,
      touristConfirmationHtml
    )

    return NextResponse.json({
      success: true,
      emailSent: ownerEmailResult.sent,
      provider: ownerEmailResult.provider,
      message: "Review submitted successfully and sent to Kekeo Safaris!",
      review: supabaseData || {
        name: trimmedName,
        email: trimmedEmail,
        location: trimmedLocation,
        tour: trimmedTour,
        rating: numRating,
        review: trimmedReview,
        created_at: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Error processing review submission:", error)
    return NextResponse.json(
      { error: "Failed to process review submission", details: error?.message },
      { status: 500 }
    )
  }
}
