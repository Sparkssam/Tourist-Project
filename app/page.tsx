"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { HeroSection } from "@/components/hero-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FeaturedTours } from "@/components/featured-tours"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { EmailLeadMagnet } from "@/components/email-lead-magnet"
import { BlogPreviews } from "@/components/blog-previews"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Component that uses useSearchParams must be wrapped in Suspense
function ErrorAlert() {
  const searchParams = useSearchParams()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setShowError(true)
      // Auto-hide after 8 seconds
      setTimeout(() => setShowError(false), 8000)
    }
  }, [searchParams])

  if (!showError) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Alert variant="destructive" className="shadow-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="font-semibold">
          Access Denied: You don't have permission to access that page.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <ErrorAlert />
      </Suspense>
      <main>
        <HeroSection />
        <WhyChooseUs />
        <FeaturedTours />
        <TestimonialsCarousel />
        <EmailLeadMagnet />
        <BlogPreviews />
      </main>
      <Footer />
    </div>
  )
}
