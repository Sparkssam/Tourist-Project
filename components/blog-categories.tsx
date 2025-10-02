"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = [
    "All",
    "Wildlife",
    "Travel Tips",
    "Cultural Experiences",
    "Conservation",
    "Photography",
    "Mount Kilimanjaro",
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className="mb-2 font-serif text-lg"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
