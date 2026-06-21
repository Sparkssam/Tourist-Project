import { HeroSection } from "@/components/hero-section"
import { WhyChooseUs } from "@/components/why-choose-us"
import { FeaturedTours } from "@/components/featured-tours"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { EmailLeadMagnet } from "@/components/email-lead-magnet"
import { BlogPreviews } from "@/components/blog-previews"
import { Footer } from "@/components/footer"
import { SafariEssentials } from "@/components/safari-essentials"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <WhyChooseUs />
        <FeaturedTours />
        <SafariEssentials /> 
        <TestimonialsCarousel />
        <EmailLeadMagnet />
        <BlogPreviews />
      </main>
      <Footer />
    </div>
  )
}
