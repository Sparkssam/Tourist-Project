"use client"

import Link from "next/link"
import { useState } from "react"
import { PesapalPaymentModal } from "./pesapal-payment-modal"

// Custom SVG icons
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.367-12 12c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.405c-.315 0-.595-.122-.807-.315-.21-.21-.315-.49-.315-.807 0-.315.105-.595.315-.807.21-.21.49-.315.807-.315.315 0 .595.105.807.315.21.21.315.49.315.807 0 .315-.105.595-.315.807-.21.193-.49.315-.807.315z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const MailIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const CreditCardIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const YouTubeIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export function Footer() {
  // State management for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  /**
   * Handle payment button click
   * Opens the Pesapal payment modal for secure payment processing
   */
  const handlePaymentClick = () => {
    setIsPaymentModalOpen(true)
  }

  /**
   * Handle payment modal close
   * Closes the payment modal and returns to normal state
   */
  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false)
  }

  return (
    <>
      <footer className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-luxury text-primary font-bold">KEKEOsafari's</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your trusted partner for authentic African safari adventures in Tanzania. Experience the wild beauty of
                Africa with our expert guides.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com/kekeosafaris"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="https://instagram.com/kekeosafaris"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://twitter.com/kekeosafaris"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href="https://youtube.com/@kekeosafaris"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <YouTubeIcon />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/tours" className="text-muted-foreground hover:text-primary transition-colors">
                    Safari Tours
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
                    Photo Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Travel Blog
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Popular Tours */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Popular Tours</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/tours/serengeti-safari"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Serengeti Safari
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/kilimanjaro-climb"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Kilimanjaro Climb
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/ngorongoro-crater"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Ngorongoro Crater
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/cultural-tour"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cultural Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tours/photography-safari"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Photography Safari
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <MapPinIcon />
                  <span className="text-muted-foreground">Arusha, Tanzania</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon />
                  <Link href="tel:+255760309999" className="text-muted-foreground hover:text-primary transition-colors">
                    +255 760 309 999
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <MailIcon />
                  <Link
                    href="mailto:samsuya999@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    samsuya999@gmail.com
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button Section */}
          <div className="border-t border-border mt-8 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              {/* PAY ONLINE Button - Real Pesapal integration */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePaymentClick}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  aria-label="Pay online through secure Pesapal payment gateway"
                >
                  <CreditCardIcon />
                  <span>PAY ONLINE</span>
                </button>
                <div className="hidden sm:block text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <ShieldCheckIcon />
                    <span>Secured by Pesapal</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="text-xs text-muted-foreground text-center sm:text-right">
                <p>Mobile Money • Cards • Bank Transfer</p>
                <p className="text-green-600 font-medium">Safe & Secure Payments</p>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="border-t border-border mt-6 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KEKEOsafari's. All rights reserved. |
              <Link href="/privacy" className="hover:text-primary transition-colors ml-1">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="/terms" className="hover:text-primary transition-colors ml-1">
                Terms of Service
              </Link>{" "}
              |
              <Link href="/faq" className="hover:text-primary transition-colors ml-1">
                FAQ
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Real Pesapal Payment Modal */}
      <PesapalPaymentModal isOpen={isPaymentModalOpen} onClose={handlePaymentModalClose} />
    </>
  )
}
