import { type NextRequest, NextResponse } from "next/server"

/**
 * Pesapal Authentication API Route
 * Handles OAuth token generation for Pesapal API 3.0
 * This endpoint authenticates with Pesapal and returns an access token
 */
export async function POST(request: NextRequest) {
  try {
    const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
    const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET
    const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3" // Sandbox URL

    // Validate required environment variables
    if (!PESAPAL_CONSUMER_KEY || !PESAPAL_CONSUMER_SECRET) {
      console.error("[v0] Missing Pesapal credentials:", {
        hasConsumerKey: !!PESAPAL_CONSUMER_KEY,
        hasConsumerSecret: !!PESAPAL_CONSUMER_SECRET,
      })
      return NextResponse.json(
        {
          success: false,
          error:
            "Pesapal credentials not configured. Please add PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET to your environment variables.",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Attempting Pesapal authentication with URL:", `${PESAPAL_BASE_URL}/api/Auth/RequestToken`)

    // Pesapal authentication request
    const authResponse = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET,
      }),
    })

    console.log("[v0] Pesapal auth response status:", authResponse.status)

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error("[v0] Pesapal authentication failed:", {
        status: authResponse.status,
        statusText: authResponse.statusText,
        error: errorText,
      })
      throw new Error(`Pesapal authentication failed: ${authResponse.status} ${errorText}`)
    }

    const authData = await authResponse.json()
    console.log("[v0] Pesapal authentication successful")

    return NextResponse.json({
      success: true,
      token: authData.token,
      expiryDate: authData.expiryDate,
    })
  } catch (error) {
    console.error("[v0] Pesapal authentication error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 },
    )
  }
}
