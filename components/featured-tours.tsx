"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export function FeaturedTours() {
  const { ref, isVisible } = useScrollAnimation()

  const tours = [
    {
      id: "serengeti-ngorongoro-safari",
      title: "The Migration Odyssey",
      image: "/serengeti-lions-and-wildebeest-migration.png",
      duration: "5-7 Days",
      groupSize: "Max 6 Travelers",
      location: "Serengeti & Ngorongoro",
      price: "From $1,200",
      description:
        "Follow the thunder of two million hooves across endless grasslands. Witness nature's greatest spectacle where predator and prey dance in the world's oldest ritual.",
      highlights: ["Great Migration", "Big Five Encounters", "Crater Wilderness"],
    },
    {
      id: "kilimanjaro-trekking-adventure",
      title: "Roof of Africa Ascent",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      duration: "6-9 Days",
      groupSize: "Max 8 Climbers",
      location: "Mount Kilimanjaro",
      price: "From $1,800",
      description:
        "Stand where earth meets sky. Journey through five climate zones to Africa's summit, where glaciers glisten and horizons stretch beyond imagination.",
      highlights: ["Uhuru Peak Summit", "Alpine Wilderness", "Expert Mountaineers"],
    },
    {
      id: "cultural-maasai-experience",
      title: "Maasai Soul Connection",
      image: "/maasai-warriors-in-traditional-dress-with-village.png",
      duration: "2-4 Days",
      groupSize: "Intimate Groups",
      location: "Maasai Heartlands",
      price: "From $600",
      description:
        "Walk alongside warriors who still read the stars. Share meals, stories, and ancient wisdom with communities whose way of life stretches back millennia.",
      highlights: ["Village Immersion", "Traditional Ceremonies", "Elder Wisdom Sharing"],
    },
    {
      id: "zanzibar-beach-extension",
      title: "Spice Islands Sanctuary",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.png",
      duration: "3-7 Days",
      groupSize: "Max 6 Guests",
      location: "Zanzibar Archipelago",
      price: "From $800",
      description:
        "Let turquoise waters heal safari-weary souls. Discover where Swahili culture blooms in stone alleys scented with cloves, cardamom, and sea salt.",
      highlights: ["UNESCO Stone Town", "Pristine Coral Reefs", "Spice Plantation Tales"],
    },
  ]

  return (
    <section ref={ref} className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-responsive-lg font-luxury text-primary mb-6">Journeys We've Perfected</h2>
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            Each route has been walked, refined, and lived by our guides over decades. These aren't just tours—they're
            chapters in your life story waiting to be written.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {tours.map((tour, index) => (
            <Card
              key={index}
              className={`overflow-hidden card-hover transition-all duration-700 ${isVisible ? "zoom-in" : "opacity-0 scale-90"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative image-hover">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-56 object-cover transition-transform duration-700"
                />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg">
                  {tour.price}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold text-card-foreground text-balance leading-tight">{tour.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <ClockIcon />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon />
                    <span className="hidden sm:inline">{tour.groupSize}</span>
                    <span className="sm:hidden">{tour.groupSize.replace("Max ", "")}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPinIcon />
                  <span>{tour.location}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-pretty font-serif line-clamp-3">{tour.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs hover:bg-muted/50 transition-colors">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <Button asChild size="lg" className="px-8 button-press hover:scale-105 transition-transform duration-300">
            <Link href="/tours">Explore All Wild Routes</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
