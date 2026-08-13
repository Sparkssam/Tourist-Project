"use client"

import { useState, useId } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calculator,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Send,
  ArrowRight,
  ShieldCheck,
  Compass,
  Mountain,
  Palmtree,
  Trees,
  Footprints,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

const DESTINATIONS = [
  {
    id: "serengeti-ngorongoro",
    name: "Serengeti & Ngorongoro Crater",
    baseDayRate: 340,
    icon: Compass,
    tag: "Most Popular",
  },
  {
    id: "kilimanjaro-climb",
    name: "Kilimanjaro Summit Trek",
    baseDayRate: 280,
    icon: Mountain,
    tag: "Alpine Trekking",
  },
  {
    id: "tarangire-manyara",
    name: "Tarangire & Lake Manyara",
    baseDayRate: 260,
    icon: Trees,
    tag: "Wildlife & Baobabs",
  },
  {
    id: "bush-to-beach",
    name: "Serengeti + Zanzibar Beach",
    baseDayRate: 390,
    icon: Palmtree,
    tag: "Bush to Coast",
  },
  {
    id: "cultural-maasai",
    name: "Maasai Immersion & Wildlife",
    baseDayRate: 220,
    icon: Footprints,
    tag: "Heritage & Wildlife",
  },
]

const TIERS = [
  {
    id: "comfort",
    name: "Classic Mid-Range",
    multiplier: 1.0,
    desc: "Handpicked safari lodges & comfortable tented camps with en-suite amenities",
  },
  {
    id: "luxury",
    name: "Luxury Wilderness",
    multiplier: 1.6,
    desc: "Exclusive five-star tented suites, private plunge pools & gourmet bush dining",
  },
  {
    id: "budget",
    name: "Adventure & Camping",
    multiplier: 0.75,
    desc: "Authentic dome camping inside national parks with full professional cook crew",
  },
]

export function SafariCostEstimator() {
  const [selectedDest, setSelectedDest] = useState(DESTINATIONS[0].id)
  const [selectedTier, setSelectedTier] = useState(TIERS[0].id)
  const [days, setDays] = useState(5)
  const [travelers, setTravelers] = useState(2)

  const daysSliderId = useId()
  const travelersSliderId = useId()

  const destObj = DESTINATIONS.find((d) => d.id === selectedDest) || DESTINATIONS[0]
  const tierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[0]

  // Group discount factor (private 4x4 cruiser cost spread among more people)
  const groupFactor = travelers === 1 ? 1.4 : travelers === 2 ? 1.0 : travelers <= 4 ? 0.85 : 0.75

  const estimatedPerPerson = Math.round(destObj.baseDayRate * tierObj.multiplier * days * groupFactor)
  const estimatedTotal = estimatedPerPerson * travelers

  const generateWhatsAppMessage = () => {
    const msg = `Hello Elibariki, I used the Kekeo Safaris Trip Estimator on your website:\n- Destination: ${destObj.name}\n- Accommodation Tier: ${tierObj.name}\n- Duration: ${days} Days\n- Group Size: ${travelers} Guests\n- Estimated Total: $${estimatedTotal.toLocaleString()} USD ($${estimatedPerPerson.toLocaleString()} per person)\n\nCould you please provide a customized itinerary proposal for our trip?`
    return encodeURIComponent(msg)
  }

  return (
    <section className="py-16 sm:py-20 px-4 bg-muted/20 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>Trip Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">
            Build Your Tailor-Made Safari
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            Customize destinations, comfort tiers, and duration for transparent real-time pricing.
          </p>
        </div>

        {/* Builder Card */}
        <Card className="border border-border shadow-xl rounded-2xl overflow-hidden bg-card">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 sm:space-y-8 border-b lg:border-b-0 lg:border-r border-border">
              {/* Step 1: Destination */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>1. Choose Safari Focus</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {DESTINATIONS.map((d) => {
                    const DestIcon = d.icon
                    const isSelected = selectedDest === d.id
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDest(d.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                            : "border-border hover:border-primary/30 bg-background"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 transition-colors ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <DestIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-card-foreground leading-tight truncate">
                            {d.name}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium">{d.tag}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2: Tier */}
              <div className="space-y-3">
                <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>2. Accommodation Style</span>
                </label>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {TIERS.map((t) => {
                    const isSelected = selectedTier === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTier(t.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
                            : "border-border hover:border-primary/30 bg-background"
                        }`}
                      >
                        <div className="text-xs font-bold text-card-foreground flex items-center justify-between">
                          <span>{t.name}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-1 line-clamp-2">
                          {t.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Sliders (Days & Travelers) */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                {/* Duration */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={daysSliderId}
                      className="text-xs font-bold text-card-foreground flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Duration:
                    </label>
                    <span className="text-sm font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                      {days} {days === 1 ? "Day" : "Days"}
                    </span>
                  </div>
                  <input
                    id={daysSliderId}
                    type="range"
                    min={2}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>2 Days</span>
                    <span>7 Days</span>
                    <span>14 Days</span>
                  </div>
                </div>

                {/* Travelers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={travelersSliderId}
                      className="text-xs font-bold text-card-foreground flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Travelers:
                    </label>
                    <span className="text-sm font-extrabold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
                      {travelers} {travelers === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>
                  <input
                    id={travelersSliderId}
                    type="range"
                    min={1}
                    max={8}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Solo (1)</span>
                    <span>Couple (2)</span>
                    <span>Group (8)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary & Action (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estimated Quote
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  >
                    All Park Fees & 4x4 Included
                  </Badge>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary">
                      ${estimatedPerPerson.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">/ person</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Total for {travelers} {travelers === 1 ? "traveler" : "travelers"}:{" "}
                    <span className="font-bold text-foreground">
                      ${estimatedTotal.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                {/* Included Checklist */}
                <div className="bg-card p-4 rounded-xl border border-border space-y-2 text-xs text-card-foreground">
                  <p className="font-bold text-xs text-primary">Your Estimate Covers:</p>
                  <ul className="space-y-1.5 text-muted-foreground text-[11px]">
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>100% Private 4x4 Safari Land Cruiser</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>All National Park Entry & Crater Fees</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Certified Professional Safari Driver Guide</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Full Board Meals & Mineral Water on Game Drives</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://wa.me/255766860273?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send This Plan to WhatsApp</span>
                </a>

                <Button asChild variant="outline" className="w-full text-xs font-semibold rounded-xl gap-2">
                  <Link
                    href={`/inquiry?tour=${destObj.id}&days=${days}&guests=${travelers}&tier=${tierObj.id}`}
                  >
                    <span>Lock In Detailed Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
