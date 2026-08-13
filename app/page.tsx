import { HeroSection } from "@/components/hero-section"
import { TrustBadges } from "@/components/trust-badges"
import { SafariCostEstimator } from "@/components/safari-cost-estimator"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FeaturedTours } from "@/components/featured-tours"
import { MigrationCalendar } from "@/components/migration-calendar"
import { CircuitRouteMap } from "@/components/circuit-route-map"
import { SafariEssentials } from "@/components/safari-essentials"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { EmailLeadMagnet } from "@/components/email-lead-magnet"
import { BlogPreviews } from "@/components/blog-previews"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <TrustBadges />
        <FeaturedTours />
        <SafariCostEstimator />
        <MigrationCalendar />
        <WhyChooseUs />
        <CircuitRouteMap />
        <SafariEssentials />
        <TestimonialsCarousel />
        <EmailLeadMagnet />
        <BlogPreviews />
      </main>
      <Footer />
    </div>
  )
}
