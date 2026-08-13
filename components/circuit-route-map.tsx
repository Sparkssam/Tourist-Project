"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, Eye, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const WAYPOINTS = [
  {
    id: "arusha",
    name: "1. Arusha Safari Gateway",
    type: "Start & Base",
    driveTime: "Arrival Point",
    image: "/arusha-tanzania-city.jpeg",
    description: "Nestled beneath Mount Meru, Arusha is the historic safari capital of East Africa. Where every epic journey begins and where our main operations team is based.",
    highlights: ["Coffee Lodge Stays", "Mount Meru Views", "Safari Briefing with Guides"],
  },
  {
    id: "tarangire",
    name: "2. Tarangire National Park",
    type: "Elephant Kingdom",
    driveTime: "2.5 hrs from Arusha",
    image: "/tarangire-elephants-baobab-trees.png",
    description: "Famous for massive elephant herds (up to 300 in a single gathering), ancient baobab trees over 1,000 years old, and seasonal river wildlife drama.",
    highlights: ["Elephant Concentrations", "Giant Baobab Silhouettes", "Over 550 Bird Species"],
  },
  {
    id: "manyara",
    name: "3. Lake Manyara & Rift Valley",
    type: "Flamingo & Canopy",
    driveTime: "1 hr from Tarangire",
    image: "/lake-natron-flamingos-tanzania.jpg",
    description: "An alkaline jewel nestled at the base of the dramatic Great Rift Valley escarpment. Renowned for tree-climbing lions and flamingo-filled waters.",
    highlights: ["Tree-Climbing Lions", "Treetop Canopy Walkway", "Lush Ground-Water Forest"],
  },
  {
    id: "ngorongoro",
    name: "4. Ngorongoro Crater",
    type: "Eighth Wonder",
    driveTime: "2 hrs from Manyara",
    image: "/tanzania-safari-leopard-tree.jpg",
    description: "The world's largest unbroken volcanic caldera. A natural sanctuary hosting over 25,000 large animals, including critically endangered black rhinos.",
    highlights: ["Black Rhino Sightings", "Dense Big Cat Population", "Highland Maasai Bomas"],
  },
  {
    id: "serengeti",
    name: "5. Serengeti National Park",
    type: "Endless Plains",
    driveTime: "3 hrs from Ngorongoro",
    image: "/serengeti-lions-and-wildebeest-migration.jpeg",
    description: "Tanzania's crown jewel. Endless golden savannas where the Great Migration unfolds. Unmatched predator density with lions, cheetahs, and leopards.",
    highlights: ["The Great Migration", "Lion Prides on Kopjes", "Hot Air Balloon Safaris"],
  },
  {
    id: "zanzibar",
    name: "6. Zanzibar Archipelago",
    type: "Island Extension",
    driveTime: "1 hr Bush Flight from Serengeti",
    image: "/zanzibar-white-sand-beach-with-dhow-boats.jpeg",
    description: "The ultimate post-safari relaxation. Powder-white sand beaches, turquoise Indian Ocean reefs, and the UNESCO Stone Town spice markets.",
    highlights: ["White Sand Beaches", "UNESCO Stone Town", "Dolphin & Coral Reef Diving"],
  },
]

export function CircuitRouteMap() {
  const [activePoint, setActivePoint] = useState(0)
  const current = WAYPOINTS[activePoint]

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/20 relative">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5" />
            <span>The Northern Tanzania Circuit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">
            Visual Safari Route Guide
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            Follow the seamless path from Arusha into the Serengeti and beyond to the spice island of Zanzibar.
          </p>
        </div>

        {/* Waypoint Stepper Tabs */}
        <div className="flex overflow-x-auto pb-3 gap-2 sm:justify-center no-scrollbar">
          {WAYPOINTS.map((wp, idx) => (
            <button
              key={wp.id}
              onClick={() => setActivePoint(idx)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                activePoint === idx
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-card hover:bg-muted text-card-foreground border-border"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span>{wp.name.replace(/^\d+\.\s*/, "")}</span>
            </button>
          ))}
        </div>

        {/* Waypoint Spotlight Card */}
        <Card className="border border-border shadow-xl rounded-2xl overflow-hidden bg-card">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Image (5 cols) */}
            <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px]">
              <img
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground font-bold text-xs border-0">
                  {current.type}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-xs text-white/90">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{current.driveTime}</span>
                </div>
              </div>
            </div>

            {/* Content (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary tracking-widest uppercase">Stage {activePoint + 1} of 6</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-card-foreground mt-1">{current.name}</h3>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground font-serif leading-relaxed">
                  {current.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-card-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    Key Experiences:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {current.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-medium"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  disabled={activePoint === 0}
                  onClick={() => setActivePoint((prev) => Math.max(0, prev - 1))}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous Stop
                </button>

                <Button asChild size="sm" className="rounded-xl gap-2 font-bold">
                  <Link href={`/tours`}>
                    <span>View Itineraries</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>

                <button
                  disabled={activePoint === WAYPOINTS.length - 1}
                  onClick={() => setActivePoint((prev) => Math.min(WAYPOINTS.length - 1, prev + 1))}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next Stop →
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
