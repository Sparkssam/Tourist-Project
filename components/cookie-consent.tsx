"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShowBanner(false)
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">We Value Your Privacy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By
              clicking "Accept", you consent to our use of cookies.{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button onClick={declineCookies} variant="outline" className="flex-1 md:flex-none bg-transparent">
              Decline
            </Button>
            <Button onClick={acceptCookies} className="flex-1 md:flex-none">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
