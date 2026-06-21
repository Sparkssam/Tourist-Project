"use client"

import { useState } from "react"
import { GalleryFilters } from "@/components/gallery-filters"
import { GalleryGrid } from "@/components/gallery-grid"
import { SocialMediaSection } from "@/components/social-media-section"
import { Footer } from "@/components/footer"

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <div className="min-h-screen">
      <main>
        <section className="relative py-16 px-4 bg-gradient-to-br from-olive/5 via-caramel/5 to-arabica/5">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-luxury text-olive animate-fade-in">Lens & Light</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed text-base md:text-lg">
              Every photograph tells a story of the wild. Browse our collection of authentic moments captured across
              Tanzania's most breathtaking landscapes, from the golden plains of Serengeti to the intimate encounters
              with wildlife and culture.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 lg:px-8">
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
