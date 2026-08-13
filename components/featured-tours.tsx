"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Clock, Users, MapPin, ArrowRight } from "lucide-react"

export function FeaturedTours() {
  const { ref, isVisible } = useScrollAnimation()

  const tours = [
    {
      id: "serengeti-ngorongoro-safari",
      title: "The Migration Odyssey",
      image: "/serengeti-lions-and-wildebeest-migration.jpeg",
      duration: "5–7 Days",
      groupSize: "Max 6 Travelers",
      location: "Serengeti & Ngorongoro",
      price: "From $1,200",
      tag: "Most Popular",
      description:
        "Follow the thunder of two million hooves across endless grasslands. Witness nature's greatest spectacle where predator and prey dance in the world's oldest ritual.",
      highlights: ["Great Migration", "Big Five", "Crater Wilderness"],
    },
    {
      id: "kilimanjaro-trekking-adventure",
      title: "Roof of Africa Ascent",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
      duration: "6–9 Days",
      groupSize: "Max 8 Climbers",
      location: "Mount Kilimanjaro",
      price: "From $1,800",
      tag: "Adventure",
      description:
        "Stand where earth meets sky. Journey through five climate zones to Africa's summit, where glaciers glisten and horizons stretch beyond imagination.",
      highlights: ["Uhuru Peak", "Alpine Wilderness", "Expert Guides"],
    },
    {
      id: "cultural-maasai-experience",
      title: "Maasai Soul Connection",
      image: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
      duration: "2–4 Days",
      groupSize: "Intimate Groups",
      location: "Maasai Heartlands",
      price: "From $600",
      tag: "Culture",
      description:
        "Walk alongside warriors who still read the stars. Share meals, stories, and ancient wisdom with communities whose way of life stretches back millennia.",
      highlights: ["Village Immersion", "Ceremonies", "Elder Wisdom"],
    },
    {
      id: "zanzibar-beach-extension",
      title: "Spice Islands Sanctuary",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.jpeg",
      duration: "3–7 Days",
      groupSize: "Max 6 Guests",
      location: "Zanzibar Archipelago",
      price: "From $800",
      tag: "Beach",
      description:
        "Let turquoise waters heal safari-weary souls. Discover where Swahili culture blooms in stone alleys scented with cloves, cardamom, and sea salt.",
      highlights: ["UNESCO Stone Town", "Coral Reefs", "Spice Plantations"],
    },
  ]

  return (
    <section ref={ref} className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-4xl font-luxury text-primary mb-4">Journeys We've Perfected</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty font-serif leading-relaxed">
            Each route has been walked, refined, and lived by our guides over decades. These aren't just tours — they're
            chapters in your life story waiting to be written.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour, index) => (
            <article
              key={index}
              className={`group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${isVisible ? "zoom-in" : "opacity-0 scale-90"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52 flex-shrink-0">
                <img
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Tag badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-2.5 py-1 border-0 shadow">
                    {tour.tag}
                  </Badge>
                </div>

                {/* Price overlay */}
                <div className="absolute top-3 right-3">
                  <div className="bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {tour.price}
                  </div>
                </div>

                {/* Bottom: location */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white/90">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{tour.location}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Title + meta */}
                <div>
                  <h3 className="text-lg font-bold text-card-foreground leading-snug mb-1 group-hover:text-primary transition-colors duration-300">
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {tour.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {tour.groupSize}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-serif leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5">
                  {tour.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs bg-primary/8 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-2 mt-auto border-t border-border">
                  <Link
                    href={`/inquiry?tour=${tour.id}`}
                    className="flex items-center justify-between w-full text-sm font-semibold text-primary hover:gap-3 group/link transition-all duration-300"
                  >
                    <span>Send Enquiry</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all CTA */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}>
          <Button asChild size="lg" className="px-8 button-press hover:scale-105 transition-transform duration-300 gap-2">
            <Link href="/tours">
              Explore All Itineraries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
