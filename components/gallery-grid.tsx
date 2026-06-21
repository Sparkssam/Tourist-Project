"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

interface GalleryGridProps {
  activeCategory: string
}

export function GalleryGrid({ activeCategory }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryItems = [
    {
      id: 1,
      src: "/serengeti-lions-and-wildebeest-migration.jpeg",
      caption: "A pride of lions resting in Serengeti National Park during the Great Migration",
      category: "Wildlife",
      size: "large", // Takes more space
    },
    {
      id: 2,
      src: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
      caption: "Climbers approaching Uhuru Peak on Mount Kilimanjaro at sunrise",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 3,
      src: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
      caption: "Maasai warriors performing traditional dance in their village",
      category: "Culture",
      size: "medium",
    },
    {
      id: 4,
      src: "/zanzibar-white-sand-beach-with-dhow-boats.jpeg",
      caption: "Traditional dhow boats on the pristine beaches of Zanzibar",
      category: "Landscapes",
      size: "large",
    },
    {
      id: 5,
      src: "/tarangire-elephants-baobab-trees.png",
      caption: "Elephant herd walking past ancient baobab trees in Tarangire",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 6,
      src: "/Homepage1.jpg",
      caption: "African savanna with iconic acacia trees silhouetted against golden hour",
      category: "Landscapes",
      size: "small",
    },
    {
      id: 7,
      src: "/wildebeest-migration-crossing-river.png",
      caption: "Wildebeest crossing the Mara River during the Great Migration",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 8,
      src: "/tanzania-safari-leopard-tree.jpg",
      caption: "Leopard resting in an acacia tree in the Serengeti",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 9,
      src: "/maasai-elder-traditional-beads-jewelry.jpeg",
      caption: "Maasai elder wearing traditional beads and jewelry",
      category: "People",
      size: "small",
    },
    {
      id: 10,
      src: "/lake-natron-flamingos-tanzania.jpg",
      caption: "Thousands of flamingos gathering at Lake Natron",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 11,
      src: "/stone-town-architecture.jpeg",
      caption: "Historic Swahili architecture in Stone Town, Zanzibar",
      category: "Culture",
      size: "small",
    },
    {
      id: 12,
      src: "/african-safari-guide-with-binoculars-in-tanzania-w.jpeg",
      caption: "Expert safari guide scanning the horizon for wildlife",
      category: "People",
      size: "medium",
    },
    {
      id: 13,
      src: "/arusha-tanzania-city.jpeg",
      caption: "Arusha city with Mount Meru in the background",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 14,
      src: "/kilimanjaro-machame-route.jpg",
      caption: "Trekkers on the Machame Route, Mount Kilimanjaro",
      category: "Landscapes",
      size: "large",
    },
    {
      id: 15,
      src: "/kilimanjaro-summit-sunrise.jpg",
      caption: "Breathtaking sunrise from Kilimanjaro's Uhuru Peak",
      category: "Landscapes",
      size: "large",
    },
    {
      id: 16,
      src: "/maasai-traditional-dance.jpeg",
      caption: "Traditional Maasai jumping dance ceremony",
      category: "Culture",
      size: "medium",
    },
    {
      id: 17,
      src: "/maasai-cattle-herding.jpeg",
      caption: "Maasai herders with their cattle at sunset",
      category: "People",
      size: "small",
    },
    {
      id: 18,
      src: "/zanzibar-spice-market.jpeg",
      caption: "Vibrant spice market in Zanzibar's historic quarter",
      category: "Culture",
      size: "medium",
    },
    {
      id: 19,
      src: "/mikumi-national-park-elephants-tanzania.jpg",
      caption: "Elephant family in Mikumi National Park",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 20,
      src: "/usambara-mountains-hiking-tanzania-villages.jpg",
      caption: "Hiking through traditional villages in the Usambara Mountains",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 21,
      src: "/mafia-island-diving-whale-shark-tanzania.jpg",
      caption: "Swimming with whale sharks off Mafia Island",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 22,
      src: "/woman-smiling-safari-hat.png",
      caption: "Happy traveler on safari adventure",
      category: "People",
      size: "small",
    },
    {
      id: 23,
      src: "/man-hiking-gear-mountain.jpeg",
      caption: "Climber equipped for Kilimanjaro trek",
      category: "People",
      size: "small",
    },
    {
      id: 24,
      src: "/conservation-success-tanzania.jpeg",
      caption: "Conservation efforts protecting Tanzania's wildlife",
      category: "Culture",
      size: "medium",
    },
    {
      id: 25,
      src: "/safari-packing-gear-binoculars-hat.png",
      caption: "Essential safari gear and equipment",
      category: "Culture",
      size: "small",
    },
    {
      id: 26,
      src: "/safari-photography-tips.png",
      caption: "Capturing the perfect wildlife moment",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 27,
      src: "/man-binoculars-safari-vest.jpeg",
      caption: "Guide spotting wildlife on morning game drive",
      category: "People",
      size: "small",
    },
    {
      id: 28,
      src: "/woman-cultural-dress-smiling.jpeg",
      caption: "Local woman in traditional Tanzanian dress",
      category: "People",
      size: "medium",
    },
    {
      id: 29,
      src: "/tarangire-elephants-baobab-trees.png",
      caption: "Elephant family beneath ancient baobab at sunset",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 30,
      src: "/serengeti-lions-and-wildebeest-migration.jpeg",
      caption: "Lioness surveying the vast herds of migrating wildebeest",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 31,
      src: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
      caption: "The majestic snow-capped peak of Africa's highest mountain",
      category: "Landscapes",
      size: "large",
    },
    {
      id: 32,
      src: "/zanzibar-white-sand-beach-with-dhow-boats.jpeg",
      caption: "Pristine white sand beaches of Zanzibar archipelago",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 33,
      src: "/wildebeest-migration-crossing-river.png",
      caption: "Dramatic river crossing during annual migration",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 34,
      src: "/lake-natron-flamingos-tanzania.jpg",
      caption: "Pink flamingos creating natural artwork on alkaline lake",
      category: "Wildlife",
      size: "medium",
    },
    {
      id: 35,
      src: "/tanzania-safari-leopard-tree.jpg",
      caption: "Elusive leopard resting in tree canopy",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 36,
      src: "/Homepage1.jpg",
      caption: "Classic African savanna at golden hour",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 37,
      src: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
      caption: "Maasai community welcoming visitors to their village",
      category: "Culture",
      size: "medium",
    },
    {
      id: 38,
      src: "/stone-town-architecture.jpeg",
      caption: "UNESCO World Heritage architecture in Zanzibar",
      category: "Culture",
      size: "small",
    },
    {
      id: 39,
      src: "/zanzibar-spice-market.jpeg",
      caption: "Colorful spices that made Zanzibar the Spice Island",
      category: "Culture",
      size: "small",
    },
    {
      id: 40,
      src: "/maasai-traditional-dance.jpeg",
      caption: "Cultural performance showcasing Maasai traditions",
      category: "Culture",
      size: "medium",
    },
    {
      id: 41,
      src: "/mikumi-national-park-elephants-tanzania.jpg",
      caption: "Elephants in their natural habitat",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 42,
      src: "/kilimanjaro-summit-sunrise.jpg",
      caption: "Reaching the Roof of Africa at dawn",
      category: "Landscapes",
      size: "large",
    },
    {
      id: 43,
      src: "/usambara-mountains-hiking-tanzania-villages.jpg",
      caption: "Hiking through lush mountain landscapes",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 44,
      src: "/mafia-island-diving-whale-shark-tanzania.jpg",
      caption: "Underwater encounter with gentle giant",
      category: "Wildlife",
      size: "large",
    },
    {
      id: 45,
      src: "/arusha-tanzania-city.jpeg",
      caption: "Gateway city to Tanzania's northern safari circuit",
      category: "Landscapes",
      size: "medium",
    },
    {
      id: 46,
      src: "/african-safari-guide-with-binoculars-in-tanzania-w.jpeg",
      caption: "Professional guides with decades of experience",
      category: "People",
      size: "small",
    },
    {
      id: 47,
      src: "/maasai-cattle-herding.jpeg",
      caption: "Traditional pastoralist lifestyle continues today",
      category: "People",
      size: "medium",
    },
    {
      id: 48,
      src: "/maasai-elder-traditional-beads-jewelry.jpeg",
      caption: "Intricate traditional Maasai jewelry",
      category: "People",
      size: "small",
    },
    {
      id: 49,
      src: "/conservation-success-tanzania.jpeg",
      caption: "Community-based conservation protecting wildlife",
      category: "Culture",
      size: "medium",
    },
    {
      id: 50,
      src: "/safari-photography-tips.png",
      caption: "Professional photography guidance on every safari",
      category: "Wildlife",
      size: "medium",
    },
  ]

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return galleryItems
    }
    return galleryItems.filter((item) => item.category === activeCategory)
  }, [activeCategory])

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredItems.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredItems.length) % filteredItems.length)
    }
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2"
      case "medium":
        return "md:col-span-1 md:row-span-1"
      case "small":
        return "md:col-span-1 md:row-span-1"
      default:
        return "md:col-span-1 md:row-span-1"
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[250px]">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 ${getSizeClass(item.size)}`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.caption}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <p className="text-white text-sm md:text-base font-light text-pretty leading-relaxed">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl w-full h-[95vh] p-0 bg-black/95 backdrop-blur">
          {selectedImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <XIcon />
              </Button>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                onClick={prevImage}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 rounded-full"
                onClick={nextImage}
              >
                <ChevronRightIcon />
              </Button>

              {/* Image */}
              <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
                <img
                  src={filteredItems[selectedImage].src || "/placeholder.svg"}
                  alt={filteredItems[selectedImage].caption}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />

                {/* Caption */}
                <div className="max-w-3xl px-6">
                  <p className="text-white text-center text-pretty text-lg leading-relaxed">
                    {filteredItems[selectedImage].caption}
                  </p>
                  <p className="text-white/60 text-center text-sm mt-2">
                    {selectedImage + 1} / {filteredItems.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
