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
          status: "approved", // Set to approved so live reviews display immediately
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

    // 2️⃣ Send Notification Email to Admin
    const adminRecipient = process.env.ENQUIRY_RECIPIENT || "doubleebariki@gmail.com"
    const stars = "⭐".repeat(numRating)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background-color: #f9f9f9;">
        <div style="background-color: #1a3d2b; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #ffffff; margin: 0;">🌟 New Tourist Review Submitted</h2>
          <p style="color: #a67c52; margin: 4px 0 0 0;">Kekeo Safaris Feedback</p>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 30%;">Rating:</td><td style="padding: 8px; font-size: 18px;">${stars} (${numRating}/5)</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Reviewer:</td><td style="padding: 8px;">${trimmedName} (&lt;<a href="mailto:${trimmedEmail}">${trimmedEmail}</a>&gt;)</td></tr>
            ${trimmedLocation ? `<tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${trimmedLocation}</td></tr>` : ""}
            ${trimmedTour ? `<tr><td style="padding: 8px; font-weight: bold;">Tour Taken:</td><td style="padding: 8px;">${trimmedTour}</td></tr>` : ""}
            <tr><td style="padding: 8px; font-weight: bold;">Submitted At:</td><td style="padding: 8px;">${new Date().toLocaleString("en-GB", { timeZone: "Africa/Nairobi" })} EAT</td></tr>
          </table>
          <div style="margin-top: 16px; background-color: #f4f6f8; padding: 16px; border-left: 4px solid #1a3d2b; border-radius: 4px;">
            <p style="margin: 0; font-style: italic; color: #444;">"${trimmedReview}"</p>
          </div>
        </div>
      </body>
      </html>
    `

    await sendEmail(
      adminRecipient,
      `New Website Review (${numRating}/5 Stars) from ${trimmedName}`,
      emailHtml
    )

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully and is published on Kekeo Safaris!",
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
