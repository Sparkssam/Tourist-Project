import { AboutHero } from "@/components/about-hero"
import { OurStory } from "@/components/our-story"
import { TeamSection } from "@/components/team-section"
import { Credentials } from "@/components/credentials"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <AboutHero />
        <OurStory />
        <TeamSection />
        <Credentials />
        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  )
}
