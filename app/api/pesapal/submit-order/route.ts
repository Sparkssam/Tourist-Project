import { type NextRequest, NextResponse } from "next/server"

/**
 * Pesapal Order Submission API Route
 * Creates a payment order with Pesapal and returns the payment URL
 * This endpoint handles the order creation and returns the iframe URL for payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, customerEmail, customerPhone, customerName } = body

    if (process.env.NODE_ENV === 'development') {
      console.log("Order submission request received")
    }

    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: amount, customerEmail, and customerName are required",
        },
        { status: 400 },
      )
    }

    // First, get authentication token
    console.log("[v0] Getting authentication token...")
    const authResponse = await fetch(`${request.nextUrl.origin}/api/pesapal/auth`, {
      method: "POST",
    })

    if (!authResponse.ok) {
      const authError = await authResponse.text()
      console.error("[v0] Authentication failed:", authError)
      throw new Error(`Failed to authenticate: ${authError}`)
    }

    const authResult = await authResponse.json()

    if (!authResult.success) {
      console.error("[v0] Authentication unsuccessful:", authResult.error)
      throw new Error(`Authentication failed: ${authResult.error}`)
    }

    const { token } = authResult
    console.log("[v0] Authentication successful, got token")

    const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3"
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin

    // Generate unique order ID
    const orderId = `KEKEO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Prepare order data for Pesapal
    const orderData = {
      id: orderId,
      currency: currency || "USD",
      amount: Number.parseFloat(amount),
      description: description || "Safari Tour Payment",
      callback_url: `${SITE_URL}/payment/callback`,
      notification_id: process.env.PESAPAL_IPN_ID || "default-ipn-id",
      billing_address: {
        email_address: customerEmail,
        phone_number: customerPhone || "+255000000000",
        country_code: "TZ",
        first_name: customerName?.split(" ")[0] || "Customer",
        last_name: customerName?.split(" ")[1] || "",
        line_1: "Arusha, Tanzania",
        city: "Arusha",
        state: "Arusha",
        postal_code: "00000",
        zip_code: "00000",
      },
    }

    console.log("[v0] Submitting order to Pesapal:", { orderId, amount: orderData.amount })

    // Submit order to Pesapal
    const orderResponse = await fetch(`${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    })

    console.log("[v0] Pesapal order response status:", orderResponse.status)

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      console.error("[v0] Order submission failed:", {
        status: orderResponse.status,
        statusText: orderResponse.statusText,
        error: errorText,
      })
      throw new Error(`Failed to create order: ${orderResponse.status} ${errorText}`)
    }

    const orderResult = await orderResponse.json()
    console.log("[v0] Order created successfully:", { orderId, trackingId: orderResult.order_tracking_id })

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentUrl: orderResult.redirect_url,
      orderTrackingId: orderResult.order_tracking_id,
    })
  } catch (error) {
    console.error("[v0] Order submission error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment order",
      },
      { status: 500 },
    )
  }
}
