"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { GOOGLE_REVIEW_URL, TRIPADVISOR_URL, TTB_URL, AWF_URL } from "@/lib/constants"
import { ExternalLink, ShieldCheck, Award, Users, Sparkles } from "lucide-react"

const TripAdvisorIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5 13.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm5-4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 4.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

export function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation()

  const features = [
    {
      icon: ShieldCheck,
      title: "Born from the Land",
      description:
        "Three generations of Tanzanian guides who know these plains like their own heartbeat. Licensed, insured, and bound by a sacred duty to protect what we share.",
      badge: "Est. 2009",
    },
    {
      icon: Award,
      title: "Guardians of Experience",
      description:
        "Our guides aren't just trained—they're storytellers, trackers, and conservationists who've spent lifetimes reading the language of the wild.",
      badge: "18+ Years",
    },
    {
      icon: Users,
      title: "Intimate Encounters",
      description:
        "Six travelers maximum. No crowded vehicles fighting for views. Just you, the wild, and moments that unfold naturally when you're truly present.",
      badge: "Max 6 Guests",
    },
    {
      icon: Sparkles,
      title: "Footprints That Fade",
      description:
        "Every journey leaves the land better than we found it. Community partnerships, carbon-neutral camps, and conservation fees that directly protect wildlife.",
      badge: "Carbon Neutral",
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-14 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <Badge variant="outline" className="mb-4 text-xs tracking-widest uppercase border-primary/30 text-primary">
            Our Pride & Legacy
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary mb-4">
            Why We Walk This Path Differently
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-serif leading-relaxed">
            In an industry flooded with promises, we offer something rarer: authenticity, earned over decades of respect for the land, its creatures, and the communities who call it home.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className={`text-center card-hover border border-primary/10 shadow-sm transition-all duration-700 ${isVisible ? "scale-up" : "opacity-0 scale-90"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center">
                  <div className="mb-5 p-4 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all duration-300 hover:scale-110">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <Badge variant="secondary" className="mb-3 text-xs font-semibold">
                    {feature.badge}
                  </Badge>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm font-serif leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recognized by Conservation Leaders Worldwide */}
        <div
          className={`mt-16 text-center border-t border-border pt-12 transition-all duration-1000 delay-500 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-xs sm:text-sm text-primary font-semibold mb-6 uppercase tracking-widest">
            Recognized by Conservation & Hospitality Leaders Worldwide
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* TripAdvisor Button */}
            <a
              href={TRIPADVISOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card hover:bg-emerald-600 hover:text-white border border-border hover:border-emerald-600 px-5 py-3 rounded-xl shadow-xs transition-all duration-300 flex items-center gap-3 text-sm font-bold text-foreground"
            >
              <div className="text-emerald-600 group-hover:text-white transition-colors">
                <TripAdvisorIcon />
              </div>
              <span>TripAdvisor Profile</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors ml-1" />
            </a>

            {/* Google Reviews Button */}
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card hover:bg-blue-600 hover:text-white border border-border hover:border-blue-600 px-5 py-3 rounded-xl shadow-xs transition-all duration-300 flex items-center gap-3 text-sm font-bold text-foreground"
            >
              <GoogleIcon />
              <span>Google Reviews</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors ml-1" />
            </a>

            {/* Tanzania Tourism Board */}
            <a
              href={TTB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card hover:bg-primary hover:text-white border border-border hover:border-primary px-5 py-3 rounded-xl shadow-xs transition-all duration-300 flex items-center gap-3 text-sm font-bold text-foreground"
            >
              <span className="text-lg">🇹🇿</span>
              <span>Tanzania Tourism Board</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors ml-1" />
            </a>

            {/* African Wildlife Foundation */}
            <a
              href={AWF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card hover:bg-amber-600 hover:text-white border border-border hover:border-amber-600 px-5 py-3 rounded-xl shadow-xs transition-all duration-300 flex items-center gap-3 text-sm font-bold text-foreground"
            >
              <span className="text-lg"></span>
              <span>African Wildlife Foundation</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
