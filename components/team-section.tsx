"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Award, Compass, Camera, HeartHandshake } from "lucide-react"

export function TeamSection() {
  const { ref, isVisible } = useScrollAnimation()

  const teamMembers = [
    {
      name: "ELIBARIKI BASSO",
      role: "Founder & Lead Safari Specialist",
      image: "/african-safari-guide-with-binoculars-in-tanzania-w.jpeg",
      bio: "With over 18 years of wildlife tracking expertise, Elibariki leads our expedition team with passion for conservation and authentic Tanzanian hospitality.",
      specialties: ["Big Five Tracking", "Wildlife Photography", "Kilimanjaro Treks"],
      icon: Award,
    },
    {
      name: "AGRICOLA BASSO",
      role: "Operations & Hospitality Director",
      image: "/grace-operations-manager-portrait.png",
      bio: "Agricola oversees all safari operations, luxury camp logistics, and guest relations to ensure every detail of your safari runs effortlessly.",
      specialties: ["Bespoke Itineraries", "Guest Relations", "Luxury Logistics"],
      icon: HeartHandshake,
    },
    {
      name: "SAMUEL MSUYA",
      role: "Senior Serengeti Expedition Guide",
      image: "/samuel-suya-founder.jpeg",
      bio: "Born and raised near the Serengeti ecosystem, Samuel possesses an innate ability to read wildlife behavior and locate elusive predator activity.",
      specialties: ["Predator Tracking", "Birdwatching", "Bush Survival"],
      icon: Compass,
    },
    {
      name: "IMRAN ABDALLAH",
      role: "Maasai Cultural Coordinator",
      image: "/marias-cultural-coordinator-portrait.png",
      bio: "Imran connects travelers with local Maasai communities, facilitating genuine, respectful cultural exchanges that support local village education.",
      specialties: ["Maasai Culture", "Community Tourism", "Traditional Crafts"],
      icon: Camera,
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 bg-background relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div
          className={`text-center space-y-4 transition-all duration-1000 ${
            isVisible ? "fade-in-up opacity-100" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge variant="outline" className="text-xs uppercase tracking-widest border-primary/30 text-primary">
            Expert Guardians of the Wild
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury text-primary">Meet Our Leadership Team</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto font-serif">
            Our passionate team of local Tanzanian experts brings decades of field experience, warm hospitality, and deep respect for the bush.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => {
            const IconComp = member.icon
            return (
              <Card
                key={index}
                className={`text-center card-hover border border-primary/10 overflow-hidden shadow-sm transition-all duration-700 ${
                  isVisible ? "scale-up opacity-100" : "opacity-0 scale-90"
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-between h-full space-y-4">
                  
                  {/* Portrait Container */}
                  <div className="relative group mb-2">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg mx-auto transition-transform duration-500 group-hover:scale-105 group-hover:border-primary">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute -bottom-2 right-1/2 translate-x-1/2 p-2 bg-primary text-primary-foreground rounded-full shadow-md">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-card-foreground tracking-tight">{member.name}</h3>
                    <p className="text-xs font-semibold text-primary tracking-wide uppercase">{member.role}</p>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground text-xs sm:text-sm font-serif leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors px-2.5 py-1 rounded-full border border-border"
                      >
                        {specialty}
                      </span>
                    ))}
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
