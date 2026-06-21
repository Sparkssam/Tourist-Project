"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TourFiltersProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  tourCounts: Record<string, number>
}

export function TourFilters({ activeFilter, setActiveFilter, tourCounts }: TourFiltersProps) {
  const filters = [
    { name: "All", count: tourCounts.All || 0 },
    { name: "Wildlife", count: tourCounts.Wildlife || 0 },
    { name: "Adventure", count: tourCounts.Adventure || 0 },
    { name: "Culture", count: tourCounts.Culture || 0 },
    { name: "Beach", count: tourCounts.Beach || 0 },
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
