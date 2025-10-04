"use client"

import { useEffect, useState } from "react"
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

export default function HomePage() {
  const searchParams = useSearchParams()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setShowError(true)
      // Auto-hide after 8 seconds
      setTimeout(() => setShowError(false), 8000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      {showError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive" className="shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              Access Denied: You don't have permission to access that page.
            </AlertDescription>
          </Alert>
        </div>
      )}
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
