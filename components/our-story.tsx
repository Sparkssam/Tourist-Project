"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ShieldCheck, Eye, Heart, Compass, MapPin } from "lucide-react"

export function OurStory() {
  const { ref, isVisible } = useScrollAnimation()

  const metrics = [
    { value: "18+", label: "Years Guiding", subtext: "In East Africa" },
    { value: "2,500+", label: "Adventurers", subtext: "Guided Safely" },
    { value: "100%", label: "Local Tanzanian", subtext: "Expert Guides" },
    { value: "5.0 ★", label: "Guest Rating", subtext: "Top Recommended" },
  ]

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Our Mission",
      description:
        "To provide exceptional, authentic safari experiences while supporting local Tanzanian communities and wildlife conservation efforts across the Serengeti and Kilimanjaro.",
      badge: "Purpose-Driven",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To be East Africa's leading sustainable tourism operator, creating positive, lasting impact for wildlife habitats, local indigenous communities, and global travelers alike.",
      badge: "Sustainable Future",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "Authenticity, ecological responsibility, respect for Maasai cultures, and an unwavering commitment to creating extraordinary, life-changing journey memories.",
      badge: "Core Beliefs",
      color: "text-rose-600 bg-rose-500/10",
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/30 safari-pattern">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Header Section */}
        <div
          className={`text-center space-y-4 transition-all duration-1000 ${
            isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/30 text-primary">
            Born from the Land • Guided by Purpose
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">Our Story & Heritage</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
            A journey built on reverence for the wilderness, deep Tanzanian roots, and a passion for unforgettable wildlife encounters.
          </p>
        </div>

        {/* Story Section Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Founder Image with Glassmorphism Overlay */}
          <div
            className={`relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-1000 ${
              isVisible ? "scale-up opacity-100" : "opacity-0 scale-95"
            }`}
          >
            <img
              src="/african-safari-guide-with-binoculars-in-tanzania-w.jpeg"
              alt="Kekeo Safaris founder Elibariki Basso on safari"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Location Tag */}
            <div className="absolute top-6 left-6 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md flex items-center gap-2 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Arusha, Tanzania</span>
            </div>

            {/* Founder Info Overlay */}
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                <h3 className="text-2xl sm:text-3xl font-luxury">Elibariki Basso</h3>
                <p className="text-amber-300 font-medium text-sm">Founder & Lead Wildlife Specialist</p>
                <p className="text-xs text-white/80 font-serif mt-2">
                  "The savanna isn't just a destination—it is a living, breathing story that demands our respect and stewardship."
                </p>
              </div>
            </div>
          </div>

          {/* Narrative & Metrics */}
          <div
            className={`space-y-8 transition-all duration-1000 delay-300 ${
              isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-card-foreground">
                Rooted in Tanzania, Respected Worldwide
              </h3>
              <p className="text-base sm:text-lg leading-relaxed text-foreground font-serif">
                Kekeo Safaris was born from an intimate connection to East Africa's wildlife reserves. Founded in 2015 by Elibariki Basso, a native Tanzanian specialist with over 18 years of guiding expertise, our organization started with a single mission: to share the raw, unfiltered magic of Tanzania with travelers from across the globe.
              </p>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground font-serif">
                What began as small group expeditions has evolved into one of Tanzania's premier luxury safari operations. Yet we maintain our core principles: intimate maximum-6-guest vehicle capacity, zero-crowd wildlife tracking, carbon-neutral practices, and direct support for indigenous Maasai communities.
              </p>
            </div>

            {/* Metric Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="bg-card p-4 rounded-xl border border-primary/10 text-center hover:border-primary/30 transition-all hover:scale-105"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary">{metric.value}</div>
                  <div className="text-xs font-semibold text-foreground mt-1">{metric.label}</div>
                  <div className="text-[11px] text-muted-foreground">{metric.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values Cards with Hover Effects */}
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          {pillars.map((pillar, index) => {
            const IconComp = pillar.icon
            return (
              <Card
                key={index}
                className={`card-hover border border-primary/10 transition-all duration-700 ${
                  isVisible ? "scale-up opacity-100" : "opacity-0 scale-90"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-4 rounded-2xl ${pillar.color}`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm font-serif">{pillar.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
