"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Users, MapPin, ArrowRight } from "lucide-react"

interface ToursGridProps {
  activeFilter: string
}

export function ToursGrid({ activeFilter }: ToursGridProps) {
  const tours = getAllTours()
  const filteredTours = activeFilter === "All" ? tours : tours.filter((t) => t.category === activeFilter)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
      {filteredTours.length === 0 && (
        <div className="col-span-full text-center py-16">
          <p className="text-muted-foreground text-lg font-serif">No itineraries found for the selected category.</p>
        </div>
      )}

      {filteredTours.map((tour, index) => (
        <article
          key={tour.id}
          className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
          style={{
            animationName: "fadeInUp",
            animationDuration: "0.6s",
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            animationDelay: `${index * 80}ms`,
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden h-60 flex-shrink-0">
            <img
              src={tour.image || "/placeholder.svg"}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
              <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground font-semibold text-sm px-3 py-1 shadow-lg border-0">
                {tour.duration}
              </Badge>
              <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white border-0 text-xs font-medium">
                {tour.category}
              </Badge>
            </div>

            {/* Bottom overlay — location */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 text-white/90">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <p className="text-xs font-medium truncate">{tour.itineraries}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            <div>
              <h3 className="text-xl font-bold text-card-foreground leading-snug mb-1.5 group-hover:text-primary transition-colors duration-300">
                {tour.title}
              </h3>
              <p className="text-muted-foreground text-sm font-serif leading-relaxed line-clamp-2">
                {tour.highlight}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-3 mt-auto flex items-end justify-between">
              <div>
                {tour.priceOnEnquiry ? (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</p>
                    <p className="text-base font-bold text-primary">On Enquiry</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Starting from</p>
                    <p className="text-2xl font-extrabold text-primary">${tour.startingPrice?.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <Button
                asChild
                size="sm"
                className="rounded-xl gap-1.5 font-semibold hover:gap-2.5 transition-all duration-300"
              >
                <Link href={`/inquiry?tour=${tour.id}`}>
                  Enquire
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export function getAllTours() {
  return [
    {
      id: "serengeti-ngorongoro-safari",
      title: "Serengeti & Ngorongoro Safari",
      image: "/serengeti-lions-and-wildebeest-migration.jpeg",
      duration: "5 Days",
      itineraries: "Serengeti · Ngorongoro Crater · Lake Manyara",
      highlight: "Witness the Great Migration and explore Africa's most iconic wildlife paradise.",
      startingPrice: 1200,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "kilimanjaro-trekking-adventure",
      title: "Kilimanjaro Summit Experience",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.jpeg",
      duration: "7 Days",
      itineraries: "Mount Kilimanjaro · Machame Route · Rainforest Zones",
      highlight: "Conquer Africa's highest peak with expert mountain guides by your side.",
      startingPrice: 1800,
      priceOnEnquiry: false,
      category: "Adventure",
    },
    {
      id: "cultural-maasai-experience",
      title: "Cultural Maasai Immersion",
      image: "/maasai-warriors-in-traditional-dress-with-village.jpeg",
      duration: "3 Days",
      itineraries: "Maasai Villages · Ngorongoro Highlands · Cultural Sites",
      highlight: "Live alongside Maasai communities in an authentic and respectful cultural exchange.",
      startingPrice: 600,
      priceOnEnquiry: false,
      category: "Culture",
    },
    {
      id: "zanzibar-beach-extension",
      title: "Zanzibar Island Escape",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.jpeg",
      duration: "4 Days",
      itineraries: "Stone Town · Spice Plantations · Pristine Beaches",
      highlight: "Unwind on powder-white sands after your safari — where the ocean heals everything.",
      startingPrice: 800,
      priceOnEnquiry: false,
      category: "Beach",
    },
    {
      id: "tarangire-lake-manyara-safari",
      title: "Tarangire & Lake Manyara Journey",
      image: "/tarangire-elephants-baobab-trees.png",
      duration: "4 Days",
      itineraries: "Tarangire National Park · Lake Manyara · Rift Valley",
      highlight: "Discover elephant herds beneath ancient baobab trees in Tanzania's hidden gem.",
      startingPrice: 950,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "ruaha-selous-wilderness",
      title: "Remote Wilderness Explorer",
      image: "/ruaha-wild-dogs-hunting.png",
      duration: "6 Days",
      itineraries: "Ruaha National Park · Selous Game Reserve · Wild Landscapes",
      highlight: "Experience untouched wilderness far from tourist trails — raw Africa at its finest.",
      startingPrice: 1500,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "arusha-national-park-day-trip",
      title: "Arusha National Park Discovery",
      image: "/arusha-tanzania-city.jpeg",
      duration: "1 Day",
      itineraries: "Arusha National Park · Mount Meru · Momella Lakes",
      highlight: "A perfect introduction to Tanzania's diverse ecosystems, just outside the city.",
      startingPrice: 180,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "lake-natron-flamingo-safari",
      title: "Lake Natron Flamingo Spectacle",
      image: "/lake-natron-flamingos-tanzania.jpg",
      duration: "3 Days",
      itineraries: "Lake Natron · Oldonyo Lengai Volcano · Flamingo Colonies",
      highlight: "Witness millions of flamingos at their only breeding ground on earth.",
      startingPrice: 750,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "mikumi-national-park-safari",
      title: "Mikumi Wildlife Encounter",
      image: "/mikumi-national-park-elephants-tanzania.jpg",
      duration: "3 Days",
      itineraries: "Mikumi National Park · Uluguru Mountains · Baobab Plains",
      highlight: "Explore Tanzania's accessible wildlife haven, ideal for a first-time safari.",
      startingPrice: 680,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "northern-circuit-grand-safari",
      title: "Grand Northern Circuit",
      image: "/tanzania-safari-leopard-tree.jpg",
      duration: "10 Days",
      itineraries: "Serengeti · Ngorongoro · Tarangire · Lake Manyara",
      highlight: "The ultimate Tanzania safari — all iconic parks, one unforgettable journey.",
      priceOnEnquiry: true,
      category: "Wildlife",
    },
    {
      id: "mafia-island-diving-adventure",
      title: "Mafia Island Marine Safari",
      image: "/mafia-island-diving-whale-shark-tanzania.jpg",
      duration: "5 Days",
      itineraries: "Mafia Island Marine Park · Coral Reefs · Whale Shark Sites",
      highlight: "Swim with whale sharks in one of the world's most pristine underwater paradises.",
      startingPrice: 1100,
      priceOnEnquiry: false,
      category: "Beach",
    },
    {
      id: "usambara-mountains-trekking",
      title: "Usambara Mountains Trek",
      image: "/usambara-mountains-hiking-tanzania-villages.jpg",
      duration: "4 Days",
      itineraries: "Usambara Mountains · Traditional Villages · Cloud Forests",
      highlight: "Trek through misty highlands and connect with mountain communities off the beaten path.",
      startingPrice: 590,
      priceOnEnquiry: false,
      category: "Adventure",
    },
  ]
}
