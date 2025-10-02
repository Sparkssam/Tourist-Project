"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TourFiltersProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
}

export function TourFilters({ activeFilter, setActiveFilter }: TourFiltersProps) {
  const filters = [
    { name: "All", count: 6 },
    { name: "Wildlife", count: 3 },
    { name: "Adventure", count: 1 },
    { name: "Culture", count: 1 },
    { name: "Beach", count: 1 },
  ]

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {filters.map((filter) => (
          <Button
            key={filter.name}
            variant={activeFilter === filter.name ? "default" : "outline"}
            onClick={() => setActiveFilter(filter.name)}
            className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 font-serif text-lg"
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
