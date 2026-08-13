"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import {
  ShieldCheck,
  Sun,
  Briefcase,
  Binoculars,
  HeartPulse,
  Headset,
} from "lucide-react"

export function SafariEssentials() {
  const { ref, isVisible } = useScrollAnimation()

  const essentials = [
    {
      icon: ShieldCheck,
      title: "Wilderness Safety & GPS",
      description:
        "All our 4x4 Land Cruisers are GPS-tracked, equipped with wilderness first aid kits, and linked via satellite radio to ground rescue networks.",
      badge: "Certified Safety",
    },
    {
      icon: Sun,
      title: "Best Travel Seasons",
      description:
        "Dry Season (June–October) offers premier predator viewing. Green Season (November–May) brings lush plains, newborn calves, and great photography.",
      badge: "Timing & Weather",
    },
    {
      icon: Briefcase,
      title: "Smart Bush Packing",
      description:
        "Pack soft-sided duffel bags under 15kg for light bush flights. Wear neutral khaki and olive layers, wide-brim hat, and high-SPF sun protection.",
      badge: "Packing Rules",
    },
    {
      icon: Binoculars,
      title: "Wildlife Respect Code",
      description:
        "We maintain a strict 20m animal buffer, keep voices low, avoid flash photography, and adhere strictly to TANAPA national park conservation bylaws.",
      badge: "Ethical Guiding",
    },
    {
      icon: HeartPulse,
      title: "Health & AMREF Coverage",
      description:
        "Every Kekeo Safaris traveler is automatically enrolled in AMREF Flying Doctors emergency medical air evacuation across East Africa.",
      badge: "Medical Insurance",
    },
    {
      icon: Headset,
      title: "24/7 Direct Ground Support",
      description:
        "Round-the-clock ground assistance (+255 766 860 273) with native operations specialists in Arusha ready to support your trip at every milestone.",
      badge: "Direct Support",
    },
  ]

  return (
    <section ref={ref} className="py-16 sm:py-20 px-4 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 sm:mb-14 space-y-3 transition-all duration-1000 ${
            isVisible ? "fade-in-up" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
            <span>Essential Knowledge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">
            Safari Essentials & Field Prep
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-serif leading-relaxed">
            Everything you need to know for a safe, comfortable, and deeply rewarding Tanzanian expedition.
          </p>
        </div>

        {/* Balanced 6-Card Grid with Website Primary Theme Icons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {essentials.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className={`group bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col justify-between ${
                  isVisible ? "zoom-in" : "opacity-0 scale-95"
                }`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardHeader className="p-6 pb-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-[11px] font-semibold border-primary/20 text-primary bg-primary/5">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground font-serif leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
