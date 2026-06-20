"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const XIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const SendIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

/**
 * Enquiry Banner Component
 * A non-intrusive banner that appears every 30 seconds to encourage users to send enquiries
 * Features: soft overlay, close button, professional messaging
 */
export function EnquiryBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const showBanner = () => {
      if (!isDismissed) {
        setIsVisible(true)
      }
    }

    // Initial delay before first appearance (1 minute)
    const initialTimer = setTimeout(showBanner, 60000)

    // Set up interval for recurring appearances (every 1 minute)
    const interval = setInterval(showBanner, 60000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [isDismissed])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Soft overlay */}
      <div className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300" onClick={handleClose} />

      {/* Banner card */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
        <Card className="bg-gradient-to-r from-primary/95 to-secondary/95 text-primary-foreground shadow-2xl border-none backdrop-blur-sm">
          <div className="p-6 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full p-1.5 transition-all"
              aria-label="Close banner"
            >
              <XIcon />
            </button>

            {/* Social media links in banner */}
            <div className="flex flex-col items-center gap-4 pr-8">
              <div className="flex-1 text-center">
                <h3 className="text-xl font-semibold mb-2">Planning a Safari in Tanzania?</h3>
                <p className="text-primary-foreground/90 text-sm mb-3">
                  Get a custom tour plan made just for you. Our safari experts will create your perfect adventure.
                </p>

                <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-primary-foreground/20">
                  <span className="text-xs text-primary-foreground/70">Follow us:</span>
                  <Link
                    href="https://instagram.com/yoursafaricompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground hover:scale-110 transition-all"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </Link>
                  <Link
                    href="https://facebook.com/yoursafaricompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground hover:scale-110 transition-all"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </Link>
                  <Link
                    href="https://twitter.com/yoursafaricompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground hover:scale-110 transition-all"
                    aria-label="Twitter"
                  >
                    <TwitterIcon />
                  </Link>
                  <Link
                    href="https://youtube.com/yoursafaricompany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/80 hover:text-primary-foreground hover:scale-110 transition-all"
                    aria-label="YouTube"
                  >
                    <YoutubeIcon />
                  </Link>
                </div>
              </div>

              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90 shadow-lg">
                <Link href="/inquiry">Enquiry</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
