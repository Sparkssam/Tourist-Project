import { type NextRequest, NextResponse } from "next/server"

/**
 * Pesapal IPN (Instant Payment Notification) Handler
 * This endpoint receives payment status updates from Pesapal
 * Register this URL in your Pesapal dashboard: https://your-domain.com/api/pesapal/ipn
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("📩 IPN Notification Received from Pesapal:")
    console.log("  - OrderTrackingId:", body.OrderTrackingId)
    console.log("  - OrderMerchantReference:", body.OrderMerchantReference)
    console.log("  - OrderNotificationType:", body.OrderNotificationType)

    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = body

    // Validate required fields
    if (!OrderTrackingId || !OrderMerchantReference) {
      console.error("❌ Invalid IPN payload: Missing required fields")
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get authentication token
    const authResponse = await fetch(`${request.nextUrl.origin}/api/pesapal/auth`, {
      method: "POST",
    })

    if (!authResponse.ok) {
      console.error("❌ Failed to authenticate with Pesapal")
      return NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 500 }
      )
    }

    const authResult = await authResponse.json()
    const { token } = authResult

    // Get transaction status from Pesapal
    const PESAPAL_BASE_URL = process.env.PESAPAL_BASE_URL || "https://cybqa.pesapal.com/pesapalv3"
    
    const statusResponse = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${OrderTrackingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!statusResponse.ok) {
      console.error("❌ Failed to get transaction status from Pesapal")
      return NextResponse.json(
        { success: false, error: "Failed to verify transaction" },
        { status: 500 }
      )
    }

    const transactionStatus = await statusResponse.json()

    console.log("✅ Transaction Status Retrieved:")
    console.log("  - Status:", transactionStatus.payment_status_description)
    console.log("  - Amount:", transactionStatus.amount)
    console.log("  - Currency:", transactionStatus.currency)

    // TODO: Update your database with the payment status
    // Example:
    // await supabase
    //   .from('payments')
    //   .update({
    //     status: transactionStatus.payment_status_description,
    //     tracking_id: OrderTrackingId,
    //     payment_method: transactionStatus.payment_method,
    //     confirmed_at: transactionStatus.confirmation_code ? new Date() : null,
    //     updated_at: new Date(),
    //   })
    //   .eq('order_id', OrderMerchantReference)

    // TODO: Send confirmation email to customer
    // TODO: Trigger any post-payment workflows (e.g., send booking confirmation)

    console.log("✅ IPN processed successfully")

    // Respond to Pesapal
    return NextResponse.json({
      success: true,
      message: "IPN received and processed",
      orderTrackingId: OrderTrackingId,
      status: transactionStatus.payment_status_description,
    })

  } catch (error) {
    console.error("❌ IPN Handler Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "IPN processing failed",
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler for IPN URL verification
 * Some payment gateways ping the URL to verify it's active
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Pesapal IPN endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
