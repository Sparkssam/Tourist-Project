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

    const userName = name || 'Valued Guest'

    // ─── Professional Safari Planning Guidebook HTML ─────────────────────────
    const guideHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tanzania Safari Planning Guide — Kekeo Safaris</title>
      </head>
      <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #2d3748; background-color: #f4f6f8; margin: 0; padding: 24px;">
        <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Corporate Header -->
          <div style="background-color: #1a3d2b; padding: 40px 32px; text-align: center; border-bottom: 4px solid #a67c52;">
            <div style="color: #a67c52; font-size: 13px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">Official Destination Guide</div>
            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">TANZANIA SAFARI PLANNING GUIDE</h1>
            <div style="color: #e2d8c3; font-size: 14px; font-weight: 500; margin-top: 6px;">Kekeo Safaris • Arusha, Tanzania</div>
          </div>

          <!-- Introduction -->
          <div style="padding: 36px 32px 24px 32px;">
            <p style="font-size: 16px; font-weight: 600; color: #1a3d2b; margin-top: 0;">
              Dear ${userName},
            </p>
            <p style="font-size: 15px; color: #4a5568; margin-bottom: 24px; text-align: justify;">
              Thank you for requesting the official <strong>Tanzania Safari Planning Guidebook</strong> from Kekeo Safaris. Whether you are planning a wildlife expedition across the Serengeti, an ascent up Mount Kilimanjaro, or a tropical retreat to Zanzibar, this guide provides essential logistical, seasonal, and practical information prepared by our senior wildlife specialists.
            </p>
          </div>

          <!-- Section 1: Seasonality & Migration Calendar -->
          <div style="padding: 0 32px 28px 32px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1a3d2b; border-bottom: 2px solid #a67c52; padding-bottom: 6px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px;">
              1. Seasonality & Wildlife Calendar
            </h2>
            <p style="font-size: 14px; color: #4a5568; margin-bottom: 16px;">
              Tanzania offers exceptional game viewing year-round. Use this seasonal breakdown to align your travel dates with your preferred wildlife phenomena:
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #1a3d2b; color: #ffffff; text-align: left;">
                  <th style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #cbd5e0;">Period</th>
                  <th style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #cbd5e0;">Season Highlight</th>
                  <th style="padding: 10px 12px; font-weight: 600; border-bottom: 1px solid #cbd5e0;">Key Regions</th>
                </tr>
              </thead>
              <tbody>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7; font-weight: 600; color: #1a3d2b;">Jan – Mar</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Wildebeest Calving Season & High Predator Activity</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Southern Serengeti (Ndutu)</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7; font-weight: 600; color: #1a3d2b;">Apr – May</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Green Season, Emerald Landscapes & Low Tourist Density</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Central Serengeti & Lake Manyara</td>
                </tr>
                <tr style="background-color: #ffffff;">
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7; font-weight: 600; color: #1a3d2b;">Jun – Oct</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Peak Dry Season & Mara River Crossings</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Northern Serengeti & Tarangire</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7; font-weight: 600; color: #1a3d2b;">Nov – Dec</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Short Rains, Migratory Bird Arrival & Fresh Pastures</td>
                  <td style="padding: 10px 12px; border-bottom: 1px solid #edf2f7;">Ngorongoro Crater & Central Parks</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Section 2: National Park Overview -->
          <div style="padding: 0 32px 28px 32px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1a3d2b; border-bottom: 2px solid #a67c52; padding-bottom: 6px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px;">
              2. Key National Parks & Destinations
            </h2>
            
            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 15px; color: #a67c52; font-weight: 700; margin: 0 0 4px 0;">Serengeti National Park</h3>
              <p style="font-size: 13px; color: #4a5568; margin: 0; line-height: 1.6;">
                A UNESCO World Heritage site featuring nearly 15,000 square kilometers of savanna. Renowned for holding the highest concentration of large mammals on Earth, including big cats, cheetahs, and the Great Migration herds.
              </p>
            </div>

            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 15px; color: #a67c52; font-weight: 700; margin: 0 0 4px 0;">Ngorongoro Conservation Area</h3>
              <p style="font-size: 13px; color: #4a5568; margin: 0; line-height: 1.6;">
                The world's largest intact volcanic caldera. Often referred to as the "Eighth Wonder of the World," the 600-meter-deep crater harbors over 25,000 large animals, including rare black rhinos.
              </p>
            </div>

            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 15px; color: #a67c52; font-weight: 700; margin: 0 0 4px 0;">Tarangire National Park</h3>
              <p style="font-size: 13px; color: #4a5568; margin: 0; line-height: 1.6;">
                Famous for its massive elephant herds (up to 300 individuals per group) and iconic ancient baobab trees along the Tarangire River.
              </p>
            </div>

            <div>
              <h3 style="font-size: 15px; color: #a67c52; font-weight: 700; margin: 0 0 4px 0;">Zanzibar Archipelago</h3>
              <p style="font-size: 13px; color: #4a5568; margin: 0; line-height: 1.6;">
                An ideal post-safari coastal extension featuring turquoise waters, historic Stone Town architecture, spice plantations, and coral reef diving.
              </p>
            </div>
          </div>

          <!-- Section 3: Essential Packing List -->
          <div style="padding: 0 32px 28px 32px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1a3d2b; border-bottom: 2px solid #a67c52; padding-bottom: 6px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px;">
              3. Comprehensive Safari Packing Checklist
            </h2>
            <div style="background-color: #fcfaf7; border-left: 4px solid #1a3d2b; padding: 18px 20px; border-radius: 4px;">
              <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #4a5568; line-height: 1.8;">
                <li><strong>Clothing:</strong> Lightweight neutral clothing (khaki, beige, olive green). Avoid dark blue or black clothing (attracts tsetse flies). Pack a warm fleece for early morning game drives.</li>
                <li><strong>Footwear:</strong> Comfortable walking shoes or sturdy trail sneakers. Flip-flops for lodge relaxations.</li>
                <li><strong>Optical & Camera Gear:</strong> Quality 8x42 or 10x42 binoculars per person, camera with a telephoto lens (200mm – 500mm), extra memory cards, and dust-protective camera bag.</li>
                <li><strong>Sun Protection:</strong> Wide-brimmed sun hat, polarized sunglasses, and broad-spectrum SPF 50+ sunscreen.</li>
                <li><strong>Health & Hygiene:</strong> Insect repellent containing DEET, personal prescription medications, hand sanitizer, and lip balm.</li>
              </ul>
            </div>
          </div>

          <!-- Section 4: Logistics & Travel Advisory -->
          <div style="padding: 0 32px 28px 32px;">
            <h2 style="font-size: 18px; font-weight: 700; color: #1a3d2b; border-bottom: 2px solid #a67c52; padding-bottom: 6px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px;">
              4. Visa, Health & Currency Guidelines
            </h2>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #4a5568; line-height: 1.8;">
              <li><strong>Entry Visas:</strong> Most travelers require a tourist visa ($50 USD for most passport holders, $100 USD for US citizens). Visas can be obtained online via the official Tanzania Immigration e-Visa portal.</li>
              <li><strong>Health Requirements:</strong> Yellow Fever vaccination certificate is mandatory if arriving from endemic countries. Consult your physician regarding Malaria prophylaxis.</li>
              <li><strong>Currency:</strong> US Dollars printed in 2013 or later are accepted everywhere in Tanzania. ATMs dispensing Tanzanian Shillings (TZS) are available in major hubs like Arusha and Stone Town.</li>
            </ul>
          </div>

          <!-- Call to Action Section -->
          <div style="background-color: #1a3d2b; padding: 32px; text-align: center; color: #ffffff;">
            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #ffffff;">READY TO BUILD YOUR CUSTOM ITINERARY?</h3>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #e2d8c3; max-w: 480px; margin-left: auto; margin-right: auto;">
              Our senior safari planners will design a bespoke safari tailored to your exact dates, travel party, and accommodation preferences.
            </p>
            <a href="https://kekeosafaris.com/inquiry" style="display: inline-block; background-color: #a67c52; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Request Custom Itinerary Proposal
            </a>
          </div>

          <!-- Corporate Footer -->
          <div style="background-color: #f8fafc; padding: 28px 32px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 4px 0; font-weight: 700; color: #1a3d2b; font-size: 14px;">KEKEO SAFARIS TANZANIA</p>
            <p style="margin: 0 0 12px 0;">Official Tour Operator • License No. TALA/2026/0491 • Arusha, Tanzania</p>
            <p style="margin: 0 0 12px 0;">
              Telephone: +255 760 309 999 • Email: info@kekeosafaris.com • Website: kekeosafaris.com
            </p>
            <p style="margin: 0; font-size: 11px; color: #a0aec0;">
              This official guide was requested via kekeosafaris.com. All content is protected by international copyright laws.
            </p>
          </div>

        </div>
      </body>
      </html>
    `

    // 2️⃣ Send the professional guide directly to the user's email
    const userEmailResult = await sendEmail(
      email,
      'Tanzania Safari Planning Guidebook — Kekeo Safaris',
      guideHtml
    )

    // 3️⃣ Send notification to admin
    const adminRecipient = process.env.ENQUIRY_RECIPIENT || 'doubleebariki@gmail.com'
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #1a3d2b; border-bottom: 2px solid #a67c52; padding-bottom: 8px;">
          New Lead Magnet Subscriber
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 30%;">Subscriber Email:</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
          ${name ? `<tr><td style="padding: 8px; font-weight: bold;">Subscriber Name:</td><td style="padding: 8px;">${name}</td></tr>` : ''}
          <tr><td style="padding: 8px; font-weight: bold;">Requested At:</td><td style="padding: 8px;">${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Nairobi' })} EAT</td></tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #666; background: #f9f9f9; padding: 12px; border-radius: 6px;">
          The professional Tanzania Safari Planning Guidebook has been automatically emailed to the subscriber.
        </p>
      </body>
      </html>
    `
    await sendEmail(
      adminRecipient,
      `New Guidebook Subscriber: ${email}`,
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
      message: 'Professional Safari Planning Guidebook sent successfully to ' + email,
    })
  } catch (err: any) {
    console.error('POST /api/send-guide error:', err?.message)
    return NextResponse.json(
      { error: 'Failed to process guide request', details: err?.message },
      { status: 500 }
    )
  }
}
