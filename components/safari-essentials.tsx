"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const ShieldIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const SunIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const BackpackIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
)

const HeartPulseIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

const BinocularsIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
)

const PhoneIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

export function SafariEssentials() {
  const { ref, isVisible } = useScrollAnimation()

  const essentials = [
    {
      icon: <ShieldIcon />,
      title: "Safety First",
      description:
        "All our vehicles are GPS-tracked and equipped with first aid kits. Our guides are certified in wilderness first response and carry satellite phones for emergency communication in remote areas.",
      badge: "Certified Safe",
    },
    {
      icon: <SunIcon />,
      title: "Best Travel Seasons",
      description:
        "Dry Season (June-October): Ideal for wildlife viewing as animals gather at waterholes. Green Season (November-May): Fewer crowds, lower prices, and dramatic landscapes. The Great Migration peaks July-August.",
      badge: "Seasonal Guide",
    },
    {
      icon: <BackpackIcon />,
      title: "What to Pack",
      description:
        "Essentials: Neutral-colored clothing, wide-brimmed hat, sunscreen (SPF 50+), binoculars, camera with zoom lens, insect repellent, and a light jacket for early morning drives. We provide detailed packing lists upon booking.",
      badge: "Packing Tips",
    },
    {
      icon: <BinocularsIcon />,
      title: "Wildlife Etiquette",
      description:
        "Maintain 20m distance from animals, never leave vehicles unless instructed, keep voices low, no flash photography near wildlife, and respect all park regulations. Remember: we are visitors in their home.",
      badge: "Respect Nature",
    },
    {
      icon: <UsersIcon />,
      title: "Cultural Sensitivity",
      description:
        "When visiting local communities, dress modestly, always ask before photographing people, learn basic Swahili greetings, and purchase crafts directly from artisans. Cultural experiences enrich both travelers and communities.",
      badge: "Cultural Respect",
    },
    {
      icon: <HeartPulseIcon />,
      title: "Health Precautions",
      description:
        "Yellow fever vaccination required. Malaria prophylaxis recommended. Bring personal medications, stay hydrated (3L+ daily), use high SPF sunscreen, and have travel insurance. We partner with AMREF Flying Doctors for evacuations.",
      badge: "Stay Healthy",
    },
    {
      icon: <PhoneIcon />,
      title: "24/7 Emergency Support",
      description:
        "Round-the-clock emergency line (+255 XXX XXX XXX), comprehensive travel insurance partnerships, direct links to medical facilities, embassy contacts, and an experienced crisis management team ready to assist anytime, anywhere.",
      badge: "Always Available",
    },
  ]

  return (
    <section ref={ref} className="py-24 px-4 bg-muted/30 safari-pattern">
      <div className="max-w-7xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="text-responsive-lg font-luxury text-primary mb-6">Safari Essentials</h2>
          <p className="text-responsive-md text-muted-foreground max-w-3xl mx-auto text-pretty">
            Everything you need to know before embarking on your African adventure. We believe informed travelers have
            the most meaningful experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {essentials.map((item, index) => (
            <Card
              key={index}
              className={`card-hover transition-all duration-700 ${isVisible ? "zoom-in" : "opacity-0 scale-90"}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">{item.icon}</div>
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-balance">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
