"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

interface GalleryFiltersProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function GalleryFilters({ activeCategory, onCategoryChange }: GalleryFiltersProps) {
  // This data should match the galleryItems in GalleryGrid
  const allImages = useMemo(() => {
    return [
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Culture" },
      { category: "Landscapes" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Wildlife" },
      { category: "Wildlife" },
      { category: "People" },
      { category: "Wildlife" },
      { category: "Culture" },
      { category: "People" },
      { category: "Landscapes" },
      { category: "Landscapes" },
      { category: "Landscapes" },
      { category: "Culture" },
      { category: "People" },
      { category: "Culture" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Wildlife" },
      { category: "People" },
      { category: "People" },
      { category: "Culture" },
      { category: "Culture" },
      { category: "Wildlife" },
      { category: "People" },
      { category: "People" },
      { category: "Wildlife" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Landscapes" },
      { category: "Wildlife" },
      { category: "Wildlife" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Culture" },
      { category: "Culture" },
      { category: "Culture" },
      { category: "Culture" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "Landscapes" },
      { category: "Wildlife" },
      { category: "Landscapes" },
      { category: "People" },
      { category: "People" },
      { category: "People" },
      { category: "Culture" },
      { category: "Wildlife" },
    ]
  }, [])

  const filters = useMemo(() => {
    const counts = {
      All: allImages.length,
      Wildlife: allImages.filter((img) => img.category === "Wildlife").length,
      Culture: allImages.filter((img) => img.category === "Culture").length,
      Landscapes: allImages.filter((img) => img.category === "Landscapes").length,
      People: allImages.filter((img) => img.category === "People").length,
    }

    return [
      { name: "All", count: counts.All },
      { name: "Wildlife", count: counts.Wildlife },
      { name: "Culture", count: counts.Culture },
      { name: "Landscapes", count: counts.Landscapes },
      { name: "People", count: counts.People },
    ]
  }, [allImages])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Explore by Category</h2>
        <p className="text-muted-foreground">Filter images to discover specific moments from our safaris</p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {filters.map((filter) => (
          <Button
            key={filter.name}
            variant={activeCategory === filter.name ? "default" : "outline"}
            onClick={() => onCategoryChange(filter.name)}
            className="flex items-center gap-2 px-6 py-6 text-base transition-all hover:scale-105"
          >
            <span>{filter.name}</span>
            <Badge variant={activeCategory === filter.name ? "secondary" : "outline"} className="ml-1">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
