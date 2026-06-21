"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const ShieldIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const AwardIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
    />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const LeafIcon = () => (
  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)

export function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation()

  const features = [
    {
      icon: ShieldIcon,
      title: "Born from the Land",
      description:
        "Three generations of Tanzanian guides who know these plains like their own heartbeat. Licensed, insured, and bound by a sacred duty to protect what we share.",
      badge: "Est. 2009",
    },
    {
      icon: AwardIcon,
      title: "Guardians of Experience",
      description:
        "Our guides aren't just trained—they're storytellers, trackers, and conservationists who've spent lifetimes reading the language of the wild.",
      badge: "18+ Years",
    },
    {
      icon: UsersIcon,
      title: "Intimate Encounters",
      description:
        "Six travelers maximum. No crowded vehicles fighting for views. Just you, the wild, and moments that unfold naturally when you're truly present.",
      badge: "Max 6 Guests",
    },
    {
      icon: LeafIcon,
      title: "Footprints That Fade",
      description:
        "Every journey leaves the land better than we found it. Community partnerships, carbon-neutral camps, and conservation fees that directly protect wildlife.",
      badge: "Carbon Neutral",
    },
  ]

  return (
    <section ref={ref} className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-3xl md:text-4xl font-luxury text-primary mb-4">Why We Walk This Path Differently</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            In an industry flooded with promises, we offer something rarer: authenticity, earned over decades of respect
            for the land, its creatures, and the communities who call it home.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`text-center card-hover transition-all duration-700 ${isVisible ? "scale-up" : "opacity-0 scale-90"}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6 md:p-8">
                <div className="mb-4 flex justify-center float" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="p-4 bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110">
                    <feature.icon />
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4 hover:scale-105 transition-transform duration-300">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty font-serif leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          className={`mt-16 text-center border-t border-border pt-12 transition-all duration-1000 delay-700 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wide">
            Recognized by Conservation Leaders Worldwide
          </p>
          <div className="flex justify-center items-center flex-wrap gap-6 md:gap-8 opacity-60">
            <div className="text-lg md:text-xl font-bold font-serif hover:opacity-100 transition-opacity duration-300">
              Tanzania Tourism Board
            </div>
            <div className="text-lg md:text-xl font-bold font-serif hover:opacity-100 transition-opacity duration-300">
              African Wildlife Foundation
            </div>
            <div className="text-lg md:text-xl font-bold font-serif hover:opacity-100 transition-opacity duration-300">
              TripAdvisor Travelers' Choice
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
