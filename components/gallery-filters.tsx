"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function GalleryFilters() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filters = [
    { name: "All", count: 48 },
    { name: "Wildlife", count: 18 },
    { name: "Landscapes", count: 12 },
    { name: "Culture", count: 8 },
    { name: "Lodges", count: 10 },
  ]

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {filters.map((filter) => (
          <Button
            key={filter.name}
            variant={activeFilter === filter.name ? "default" : "outline"}
            onClick={() => setActiveFilter(filter.name)}
            className="flex items-center space-x-2"
          >
            <span>{filter.name}</span>
            <Badge variant="secondary" className="ml-2">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
