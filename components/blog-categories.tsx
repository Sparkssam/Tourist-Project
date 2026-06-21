"use client"

import { Button } from "@/components/ui/button"

interface BlogCategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function BlogCategories({ activeCategory, onCategoryChange }: BlogCategoriesProps) {
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
            onClick={() => onCategoryChange(category)}
            className="mb-2 font-serif text-lg transition-all duration-300 hover:scale-105"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
