'use client'

import { useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AlertIcon = () => (
  <svg className="h-24 w-24 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development (won't expose in production)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <AlertIcon />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold mb-2">Something Went Wrong</CardTitle>
            <CardDescription className="text-lg">
              We encountered an unexpected error
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              Don't worry, our team has been notified and we're working to fix the issue.
            </p>
            <p className="text-sm">
              Please try refreshing the page or return to the homepage.
            </p>
          </div>

          {/* Error ID for support (only show digest, not full error) */}
          {error.digest && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-xs text-muted-foreground text-center">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Please provide this ID when contacting support
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button onClick={reset} variant="default" size="lg" className="w-full">
              <RefreshIcon />
              <span className="ml-2">Try Again</span>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/" className="flex items-center justify-center gap-2">
                <HomeIcon />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-3 text-center">Quick Links</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/tours" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Safari Tours
              </Link>
              <Link href="/contact" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                Contact Us
              </Link>
              <Link href="/about" className="text-sm text-center p-2 rounded-md hover:bg-accent transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
            <p>Need immediate assistance?</p>
            <a href="mailto:support@kekeosafaris.com" className="text-primary hover:underline font-medium">
              support@kekeosafaris.com
            </a>
            <span className="mx-2">or</span>
            <a href="tel:+255760309999" className="text-primary hover:underline font-medium">
              +255 760 309 999
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
