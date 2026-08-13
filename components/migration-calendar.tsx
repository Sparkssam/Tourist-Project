"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Compass, Sun, Droplets, Camera, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"

const SEASONS = [
  {
    months: "January – March",
    period: "Calving Season & Predator Action",
    location: "Southern Serengeti & Ndutu Plains",
    tag: "Spectacular Calving",
    tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    description:
      "Over 8,000 wildebeest calves are born daily on the nutrient-rich southern plains. Cheetahs, lions, leopards, and hyenas gather for unmatched predator hunting encounters.",
    highlights: ["400,000+ Calves Born", "Big Cat Action", "Warm & Dry Days", "Flocks of Flamingos"],
    weather: "Warm & Dry (28°C / 82°F)",
    crowds: "Moderate",
    photoRating: "★★★★★ (5/5)",
  },
  {
    months: "April – May",
    period: "Green Season & Rutting",
    location: "Central & Western Serengeti",
    tag: "Lush & Quiet",
    tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    description:
      "Emerald green landscapes, dramatic thundercloud skies, zero tourist congestion, and lower lodge rates. Herds begin their mass march westward toward the Grumeti River.",
    highlights: ["Dramatic Photography", "Zero Crowds", "Best Value Rates", "Vibrant Birdwatching"],
    weather: "Afternoon Showers (25°C / 77°F)",
    crowds: "Very Low",
    photoRating: "★★★★☆ (4.5/5)",
  },
  {
    months: "June – July",
    period: "Grumeti River Crossings",
    location: "Western Corridor & Central Serengeti",
    tag: "Grumeti Crossings",
    tagColor: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30",
    description:
      "Wildebeest build up along the Grumeti River, facing giant Nile crocodiles. The transition from wet to dry season forces wildlife to concentrate around water sources.",
    highlights: ["River Drama Begins", "Elephants in Tarangire", "Cool Clear Nights", "Peak Game Viewing"],
    weather: "Cool & Dry (23°C / 73°F)",
    crowds: "Moderate to High",
    photoRating: "★★★★★ (5/5)",
  },
  {
    months: "August – October",
    period: "Legendary Mara River Crossings",
    location: "Northern Serengeti & Kogatende",
    tag: "World's Greatest Spectacle",
    tagColor: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
    description:
      "The pinnacle of the Great Migration. Millions of wildebeest plunge down steep cliffs into the rushing Mara River, braving predators in heart-stopping life-or-death drama.",
    highlights: ["Iconic River Crossings", "Big Five Everywhere", "Dry Sunny Skies", "Tarangire Elephant Herds"],
    weather: "Crisp & Sunny (26°C / 79°F)",
    crowds: "High (Book Early)",
    photoRating: "★★★★★ (5/5)",
  },
  {
    months: "November – December",
    period: "Short Rains & Southbound Migration",
    location: "Northern to Central Serengeti",
    tag: "Calm & Rewarding",
    tagColor: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30",
    description:
      "Nourishing short rains trigger the herds to begin their journey south across Lobo and Seronera. Excellent combination of blooming savannas and holiday safaris.",
    highlights: ["Herds Heading South", "Christmas Safaris", "Superb Bird Migrations", "Lush Landscapes"],
    weather: "Short Refreshing Showers (27°C / 80°F)",
    crowds: "Moderate",
    photoRating: "★★★★☆ (4.5/5)",
  },
]

export function MigrationCalendar() {
  const [activeSeason, setActiveSeason] = useState(0)
  const current = SEASONS[activeSeason]

  return (
    <section className="py-16 sm:py-20 px-4 bg-background relative">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Seasonal Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">
            Serengeti Great Migration Calendar
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            The migration never stops. Find the exact month that matches your dream safari experience.
          </p>
        </div>

        {/* Season Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {SEASONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSeason(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeSeason === idx
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-card hover:bg-muted text-card-foreground border-border"
              }`}
            >
              <span>{s.months}</span>
            </button>
          ))}
        </div>

        {/* Selected Season Detail Card */}
        <Card className="border border-border shadow-xl rounded-2xl overflow-hidden bg-card">
          <div className="h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          <CardContent className="p-6 sm:p-10 space-y-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border mb-2 ${current.tagColor}`}>
                  {current.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-card-foreground">{current.period}</h3>
                <p className="text-xs sm:text-sm text-primary font-medium flex items-center gap-1.5 mt-1">
                  <Compass className="w-4 h-4" />
                  Primary Location: {current.location}
                </p>
              </div>

              <div className="flex sm:flex-col items-end gap-2 text-right">
                <div className="bg-muted/40 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <span className="text-muted-foreground">Photo Rating: </span>
                  <span className="text-amber-500 font-bold">{current.photoRating}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground font-serif leading-relaxed">
              {current.description}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {current.highlights.map((h, i) => (
                <div key={i} className="bg-muted/30 border border-border p-3 rounded-xl text-center">
                  <span className="text-xs font-bold text-card-foreground">{h}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-card-foreground">Weather: </span>
                  <span className="text-muted-foreground">{current.weather}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-card-foreground">Crowd Density: </span>
                  <span className="text-muted-foreground">{current.crowds}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground font-serif italic text-center sm:text-left">
                Want to travel during {current.months}? Our guides track herd movements in real time.
              </span>

              <Button asChild className="w-full sm:w-auto rounded-xl gap-2 font-bold">
                <Link href={`/inquiry?season=${encodeURIComponent(current.months)}`}>
                  <span>Book for {current.months}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
