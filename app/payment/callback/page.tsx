"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

/**
 * Payment Callback Page
 * Handles the redirect from Pesapal after payment completion
 * Shows payment status and provides next steps to the user
 */
export default function PaymentCallback() {
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "failed" | "pending">("loading")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const orderTrackingId = searchParams.get("OrderTrackingId")
    const merchantReference = searchParams.get("OrderMerchantReference")

    if (orderTrackingId) {
      // Verify payment status with Pesapal
      verifyPaymentStatus(orderTrackingId, merchantReference)
    } else {
      setPaymentStatus("failed")
    }
  }, [searchParams])

  const verifyPaymentStatus = async (trackingId: string, merchantRef: string | null) => {
    try {
      // In a real implementation, you would call your API to verify the payment status
      // For now, we'll simulate the verification process
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // Mock verification - in production, call Pesapal's GetTransactionStatus API
      const mockSuccess = Math.random() > 0.2 // 80% success rate for demo

      setOrderDetails({
        orderId: merchantRef || `KEKEO-${Date.now()}`,
        trackingId: trackingId,
        amount: "$500.00", // This would come from your database
        description: "Safari Tour Payment",
      })

      setPaymentStatus(mockSuccess ? "success" : "failed")
    } catch (error) {
      console.error("Payment verification error:", error)
      setPaymentStatus("failed")
    }
  }

  const LoadingIcon = () => (
    <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )

  const SuccessIcon = () => (
    <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  const FailedIcon = () => (
    <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        {paymentStatus === "loading" && (
          <>
            <LoadingIcon />
            <h1 className="text-2xl font-bold text-foreground mt-4">Verifying Payment</h1>
            <p className="text-muted-foreground mt-2">Please wait while we confirm your payment status...</p>
          </>
        )}

        {paymentStatus === "success" && (
          <>
            <SuccessIcon />
            <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h1>
            <p className="text-muted-foreground mt-2">
              Thank you for your payment. Your safari booking has been confirmed.
            </p>

            {orderDetails && (
              <div className="bg-muted rounded-lg p-4 mt-6 text-left">
                <h3 className="font-semibold text-foreground mb-2">Order Details:</h3>
                <p className="text-sm text-muted-foreground">Order ID: {orderDetails.orderId}</p>
                <p className="text-sm text-muted-foreground">Amount: {orderDetails.amount}</p>
                <p className="text-sm text-muted-foreground">Description: {orderDetails.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/tours"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse More Tours
              </Link>
              <Link
                href="/contact"
                className="bg-muted text-muted-foreground px-6 py-2 rounded-lg hover:bg-muted/80 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <FailedIcon />
            <h1 className="text-2xl font-bold text-red-600 mt-4">Payment Failed</h1>
            <p className="text-muted-foreground mt-2">
              We couldn't process your payment. Please try again or contact us for assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => window.history.back()}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/contact"
                className="bg-muted text-muted-foreground px-6 py-2 rounded-lg hover:bg-muted/80 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
