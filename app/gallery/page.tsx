import { GalleryGrid } from "@/components/gallery-grid"
import { GalleryFilters } from "@/components/gallery-filters"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Photo Gallery - KEKEOsafari's | Tanzania Safari Photos",
  description:
    "Browse our stunning collection of safari photos and videos from Tanzania's national parks and cultural experiences.",
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-luxury text-primary mb-6">Safari Gallery</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-pretty font-serif text-2xl">
              Experience the beauty of Tanzania through our lens. Browse stunning wildlife photography, breathtaking
              landscapes, and authentic cultural moments.
            </p>
          </div>
        </section>

        {/* Filters and Gallery */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <GalleryFilters />
            <GalleryGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
