import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/send-email'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = (body.email || '').trim()
    const name = (body.name || '').trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      )
    }

    const userName = name || 'Safari Adventurer'

    // 1️⃣ Generate the Safari Guide HTML Letter for the user
    const guideHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Free Safari Planning Guide</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.7; color: #333333; background-color: #f4f1ea; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e0d7c6;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%); padding: 36px 24px; text-align: center; color: #ffffff;">
            <div style="font-size: 42px; margin-bottom: 8px;">🦁</div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff;">Your Free Safari Planning Guide</h1>
            <p style="margin: 6px 0 0 0; color: #d4c8aa; font-size: 14px; font-weight: 500;">Kekeo Safaris • Authentic Tanzanian Experience</p>
          </div>

          <!-- Content -->
          <div style="padding: 32px 28px;">
            <p style="font-size: 17px; font-weight: 600; color: #1a3d2b; margin-top: 0;">
              Jambo ${userName}! 👋
            </p>

            <p style="font-size: 15px; color: #555555; margin-bottom: 24px;">
              Thank you for downloading our official <strong>Tanzania Safari Planning Guide</strong>! We're thrilled to help you prepare for the adventure of a lifetime in East Africa.
            </p>

            <!-- Guide Highlights Box -->
            <div style="background-color: #fcf9f2; border-left: 4px solid #a67c52; border-radius: 6px; padding: 20px; margin: 24px 0;">
              <h2 style="margin-top: 0; color: #a67c52; font-size: 18px; font-weight: 700;">📚 What's Inside Your Guidebook:</h2>
              <ul style="margin: 12px 0 0 0; padding-left: 20px; color: #444444; font-size: 14px; line-height: 1.8;">
                <li style="margin-bottom: 8px;"><strong>🗓️ Best Times to Visit:</strong> High season (June-Oct) for the Great Migration & Dry Season game viewing.</li>
                <li style="margin-bottom: 8px;"><strong>🎒 Essential Packing List:</strong> Neutral clothing, high-zoom camera gear, sun protection, and comfortable boots.</li>
                <li style="margin-bottom: 8px;"><strong>🦁 The Big Five Map:</strong> Where to spot Lion, Leopard, Elephant, Rhino, and Buffalo in Serengeti & Ngorongoro.</li>
                <li style="margin-bottom: 8px;"><strong>🏔️ Kilimanjaro Routes:</strong> Overview of Machame, Lemosho, and Marangu trekking trails.</li>
                <li style="margin-bottom: 8px;"><strong>🏖️ Zanzibar Beach Extension:</strong> Combining wildlife safaris with tropical island relaxation.</li>
                <li style="margin-bottom: 8px;"><strong>💡 Insider Travel Tips:</strong> Visa guidelines, health recommendations, and local Maasai etiquette.</li>
              </ul>
            </div>

            <!-- Call To Action -->
            <div style="text-align: center; margin: 32px 0 24px 0;">
              <a href="https://kekeosafaris.com/tours" style="display: inline-block; background: linear-gradient(135deg, #a67c52, #c49a6c); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(166,124,82,0.3);">
                🌍 Explore Tanzania Safari Packages
              </a>
            </div>

            <div style="background-color: #f0f7f4; border: 1px solid #c8e6c9; border-radius: 8px; padding: 18px; text-align: center; margin-top: 24px;">
              <p style="margin: 0; font-size: 14px; color: #2d6a4f; font-weight: 600;">
                Ready to plan your custom safari?
              </p>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #4a5568;">
                Our expert guides tailor every trip around your dates, pace, and preferences.
              </p>
              <a href="https://kekeosafaris.com/inquiry" style="display: inline-block; margin-top: 10px; color: #1a3d2b; font-weight: 700; font-size: 13px; text-decoration: underline;">
                Request Your Personal Custom Itinerary →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9f6f0; padding: 24px; text-align: center; font-size: 12px; color: #777777; border-top: 1px solid #e0d7c6;">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #1a3d2b; font-size: 13px;">Kekeo Safaris</p>
            <p style="margin: 0 0 12px 0;">Arusha, Tanzania • info@kekeosafaris.com</p>
            <p style="margin: 0; font-size: 11px; color: #999999;">
              You received this email because you requested the Free Safari Planning Guide from kekeosafaris.com.
            </p>
          </div>

        </div>
      </body>
      </html>
    `

    // 2️⃣ Send the guide directly to the user's email
    const userEmailResult = await sendEmail(
      email,
      '🦁 Your Free Safari Planning Guide — Kekeo Safaris',
      guideHtml
    )

    // 3️⃣ Send notification to admin so they know a new lead requested the guide
    const adminRecipient = process.env.ENQUIRY_RECIPIENT || 'doubleebariki@gmail.com'
    const adminNotificationHtml = `
      <h3>📬 New Lead: Free Safari Planning Guide Requested</h3>
      <p><strong>Subscriber Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} EAT</p>
      <p><em>The Safari Planning Guide letter has been automatically dispatched to the user.</em></p>
    `
    await sendEmail(
      adminRecipient,
      `New Lead Magnet Download: ${email}`,
      adminNotificationHtml
    )

    // 4️⃣ Log to Supabase (non-blocking)
    try {
      const supabase = createSupabaseClient()
      await supabase.from('subscribers').insert({ email, name: name || null })
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      emailSent: userEmailResult.sent,
      provider: userEmailResult.provider,
      message: 'Safari Planning Guide sent successfully to ' + email,
    })
  } catch (err: any) {
    console.error('POST /api/send-guide error:', err?.message)
    return NextResponse.json(
      { error: 'Failed to process guide request', details: err?.message },
      { status: 500 }
    )
  }
}
