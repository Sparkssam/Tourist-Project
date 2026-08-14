"use client"

import { useState } from "react"
import { GalleryHero } from "@/components/gallery-hero"
import { GalleryFilters } from "@/components/gallery-filters"
import { GalleryGrid } from "@/components/gallery-grid"
import { SocialMediaSection } from "@/components/social-media-section"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Full-width Photo Hero */}
        <GalleryHero />

        <section className="py-12 sm:py-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <GalleryFilters activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
            <GalleryGrid activeCategory={activeCategory} />
          </div>
        </section>

        <SocialMediaSection />
      </main>
      <Footer />
    </div>
  )
}
