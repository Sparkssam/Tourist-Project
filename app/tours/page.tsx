"use client"

import { useState, useMemo } from "react"
import { ToursGrid, getAllTours } from "@/components/tours-grid"
import { TourFilters } from "@/components/tour-filters"
import { SafariCostEstimator } from "@/components/safari-cost-estimator"
import { CircuitRouteMap } from "@/components/circuit-route-map"
import { TrustBadges } from "@/components/trust-badges"
import { SocialMediaSection } from "@/components/social-media-section"
import { Footer } from "@/components/footer"

export default function ToursPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const tourCounts = useMemo(() => {
    const tours = getAllTours()
    const counts: Record<string, number> = {
      All: tours.length,
      Wildlife: 0,
      Adventure: 0,
      Culture: 0,
      Beach: 0,
    }

    tours.forEach((tour) => {
      if (counts[tour.category] !== undefined) {
        counts[tour.category]++
      }
    })

    return counts
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 px-4 bg-muted/30 border-b border-border">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h1 className="text-4xl sm:text-5xl font-luxury text-primary">Handcrafted Safari Itineraries</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty font-serif text-sm sm:text-base leading-relaxed">
              From the great wildebeest migration across the Serengeti to reaching the snowy peak of Mount Kilimanjaro, discover Tanzania with native guides.
            </p>
          </div>
        </section>

        {/* Filters and Tours Grid */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto space-y-10">
            <TourFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} tourCounts={tourCounts} />
            <ToursGrid activeFilter={activeFilter} />
          </div>
        </section>

        {/* Trust Badges */}
        <TrustBadges />

        {/* Interactive Custom Safari Estimator */}
        <SafariCostEstimator />

        {/* Route Circuit Map */}
        <CircuitRouteMap />

        <SocialMediaSection />
      </main>
      <Footer />
    </div>
  )
}
