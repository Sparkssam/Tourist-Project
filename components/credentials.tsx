"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Award, Shield, Users, Leaf, CheckCircle2 } from "lucide-react"

export function Credentials() {
  const { ref, isVisible } = useScrollAnimation()

  const credentials = [
    {
      icon: Award,
      title: "Licensed Tour Operator",
      description: "Fully licensed by the Tanzania Tourism Licensing Authority (TTLA)",
      certification: "License #TALA/2026/0491",
      badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    {
      icon: Shield,
      title: "Safety Certified",
      description: "Certified member of Tanzania Association of Tour Operators (TATO)",
      certification: "TATO Active Member",
      badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      icon: Users,
      title: "Expert Certified Guides",
      description: "All guides certified by Tanzania Professional Hunters & Trackers Association",
      certification: "TPHA Certified Specialists",
      badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      icon: Leaf,
      title: "Sustainable Tourism",
      description: "Committed to carbon-neutral camps and wildlife habitat protection",
      certification: "Eco-Tourism Standard Certified",
      badgeColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div
          className={`text-center space-y-4 transition-all duration-1000 ${
            isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/30 text-primary">
            Official Accreditations & Safety
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">Our Credentials & Guarantees</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto font-serif">
            Trust and safety are our foundation. We maintain full statutory compliance and the highest safety protocols in the Tanzanian safari industry.
          </p>
        </div>

        {/* Credentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((credential, index) => {
            const Icon = credential.icon
            return (
              <Card
                key={index}
                className={`text-center card-hover border border-primary/10 transition-all duration-700 shadow-sm ${
                  isVisible ? "scale-up opacity-100" : "opacity-0 scale-90"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-between h-full space-y-4">
                  <div className="p-4 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-card-foreground">{credential.title}</h3>
                    <p className="text-muted-foreground font-serif text-sm leading-relaxed">{credential.description}</p>
                  </div>

                  <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5 ${credential.badgeColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{credential.certification}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}
