"use client"

import type React from "react"

// Custom SVG icons for the modal
const XIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const CreditCardIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * PaymentModal Component
 *
 * This modal displays a placeholder message for Pesapal payment integration.
 * In a production environment, this would redirect users to a secure Pesapal
 * payment gateway to complete their transaction.
 *
 * Features:
 * - Modal overlay with backdrop blur
 * - Responsive design for mobile and desktop
 * - Professional styling with payment-related icons
 * - Clear explanation of the payment process
 * - Accessible close functionality
 */
export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  if (!isOpen) return null

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-background border border-border rounded-lg shadow-2xl max-w-md w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <CreditCardIcon />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Secure Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close payment modal"
          >
            <XIcon />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <ShieldCheckIcon />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Secured by Pesapal</span>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Payment Integration Ready</h3>
            <p className="text-muted-foreground leading-relaxed">
              This would redirect you to a secure Pesapal payment page to complete your transaction. Your payment
              information will be processed safely through Pesapal's encrypted gateway.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Secure SSL encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Multiple payment methods supported</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Instant payment confirmation</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
