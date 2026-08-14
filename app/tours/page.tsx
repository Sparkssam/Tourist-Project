"use client"

import { useState, useMemo } from "react"
import { ToursHero } from "@/components/tours-hero"
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
        {/* Full-width Photo Hero */}
        <ToursHero />

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
