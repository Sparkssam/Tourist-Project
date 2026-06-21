import { Card, CardContent } from "@/components/ui/card"

export function TeamSection() {
  const teamMembers = [
    {
      name: "Samuel Suya",
      role: "Founder & Lead Guide",
      image: "/samuel-suya-founder-portrait.png",
      bio: "With over 15 years of guiding experience, Samuel founded KEKEOsafaris to share his deep knowledge of Tanzania's wildlife and culture with the world.",
      specialties: ["Wildlife Photography", "Cultural Tours", "Mount Kilimanjaro"],
    },
    {
      name: "Grace Mwangi",
      role: "Operations Manager",
      image: "/grace-operations-manager-portrait.png",
      bio: "Grace ensures every detail of your safari is perfectly planned. Her attention to detail and warm hospitality make every journey seamless.",
      specialties: ["Trip Planning", "Guest Relations", "Logistics"],
    },
    {
      name: "Joseph Kimani",
      role: "Senior Safari Guide",
      image: "/joseph-senior-guide-portrait.png",
      bio: "Born and raised near the Serengeti, Joseph has an incredible eye for spotting wildlife and sharing the stories of the African bush.",
      specialties: ["Big Five Tracking", "Bird Watching", "Conservation"],
    },
    {
      name: "Maria Temba",
      role: "Cultural Experience Coordinator",
      image: "/maria-cultural-coordinator-portrait.png",
      bio: "Maria bridges the gap between visitors and local Maasai communities, creating authentic cultural exchanges that benefit everyone.",
      specialties: ["Maasai Culture", "Community Tourism", "Traditional Crafts"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance font-serif text-2xl">
            Our passionate team of local experts is dedicated to creating unforgettable safari experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                  />
                  <h3 className="text-card-foreground text-2xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </div>
                <p className="text-muted-foreground mb-4 text-pretty font-serif text-lg">{member.bio}</p>
                <div className="space-y-1">
                  {member.specialties.map((specialty, idx) => (
                    <div key={idx} className="text-xs bg-muted px-2 py-1 rounded-full inline-block mr-1">
                      {specialty}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
