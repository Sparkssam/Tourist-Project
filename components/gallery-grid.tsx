"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react"

export function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryItems = [
    {
      id: 1,
      src: "/serengeti-lions-and-wildebeest-migration.png",
      caption: "A pride of lions resting in Serengeti National Park during the Great Migration",
      category: "Wildlife",
      type: "image",
    },
    {
      id: 2,
      src: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      caption: "Climbers approaching Uhuru Peak on Mount Kilimanjaro at sunrise",
      category: "Landscapes",
      type: "image",
    },
    {
      id: 3,
      src: "/maasai-warriors-in-traditional-dress-with-village.png",
      caption: "Maasai warriors performing traditional dance in their village",
      category: "Culture",
      type: "image",
    },
    {
      id: 4,
      src: "/zanzibar-white-sand-beach-with-dhow-boats.png",
      caption: "Traditional dhow boats on the pristine beaches of Zanzibar",
      category: "Landscapes",
      type: "image",
    },
    {
      id: 5,
      src: "/tarangire-elephants-baobab-trees.png",
      caption: "Elephant herd walking past ancient baobab trees in Tarangire",
      category: "Wildlife",
      type: "image",
    },
    {
      id: 6,
      src: "/luxury-safari-camp-sunset.png",
      caption: "Luxury tented camp at sunset with views of the African savanna",
      category: "Lodges",
      type: "image",
    },
    {
      id: 7,
      src: "/ngorongoro-crater-elephants.png",
      caption: "Elephants grazing in the Ngorongoro Crater",
      category: "Wildlife",
      type: "image",
    },
    {
      id: 8,
      src: "/serengeti-cheetah-hunting.png",
      caption: "Cheetah hunting on the Serengeti plains",
      category: "Wildlife",
      type: "video",
    },
    {
      id: 9,
      src: "/maasai-elder-traditional-beads-jewelry.png",
      caption: "Maasai elder wearing traditional beads and jewelry",
      category: "Culture",
      type: "image",
    },
    {
      id: 10,
      src: "/ruaha-wild-dogs-hunting.png",
      caption: "African wild dogs on a hunt in Ruaha National Park",
      category: "Wildlife",
      type: "video",
    },
    {
      id: 11,
      src: "/stone-town-spice-market.png",
      caption: "Colorful spices in Stone Town market, Zanzibar",
      category: "Culture",
      type: "image",
    },
    {
      id: 12,
      src: "/safari-lodge-dining-area.png",
      caption: "Open-air dining area at a luxury safari lodge",
      category: "Lodges",
      type: "image",
    },
  ]

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryItems.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryItems.length) % galleryItems.length)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

            {/* Video Play Button */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3 group-hover:bg-white transition-colors duration-300">
                  <Play className="h-6 w-6 text-primary" />
                </div>
              </div>
            )}

            {/* Caption on Hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm text-pretty">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black">
          {selectedImage !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Image */}
              <img
                src={galleryItems[selectedImage].src || "/placeholder.svg"}
                alt={galleryItems[selectedImage].caption}
                className="max-w-full max-h-full object-contain"
              />

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-center text-pretty">{galleryItems[selectedImage].caption}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
