"use client"

import { useState, useMemo } from "react"
import { ToursGrid, getAllTours } from "@/components/tours-grid"
import { TourFilters } from "@/components/tour-filters"
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
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-luxury text-primary mb-6">Safari Adventures</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-pretty font-serif text-2xl">
              Discover Tanzania's incredible wildlife, breathtaking landscapes, and rich cultural heritage through our
              expertly crafted safari experiences.
            </p>
          </div>
        </section>

        {/* Filters and Tours Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <TourFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} tourCounts={tourCounts} />
            <ToursGrid activeFilter={activeFilter} />
          </div>
        </section>

        <SocialMediaSection />
      </main>
      <Footer />
    </div>
  )
}
