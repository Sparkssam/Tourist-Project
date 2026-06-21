import { Card, CardContent } from "@/components/ui/card"
import { Award, Shield, Users, Leaf } from "lucide-react"

export function Credentials() {
  const credentials = [
    {
      icon: Award,
      title: "Licensed Tour Operator",
      description: "Fully licensed by Tanzania Tourism Licensing Authority (TTLA)",
      certification: "License #TO.LE.2015.0234",
    },
    {
      icon: Shield,
      title: "Safety Certified",
      description: "Certified by Tanzania Association of Tour Operators (TATO)",
      certification: "Member since 2015",
    },
    {
      icon: Users,
      title: "Expert Guides",
      description: "All guides certified by Tanzania Professional Hunters Association",
      certification: "TPHA Certified",
    },
    {
      icon: Leaf,
      title: "Sustainable Tourism",
      description: "Committed to responsible tourism practices and conservation",
      certification: "Green Tourism Certified",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Our Credentials</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Trust and safety are our top priorities. We maintain the highest standards in the industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((credential, index) => {
            const Icon = credential.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{credential.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3 text-pretty font-serif text-base">{credential.description}</p>
                  <div className="text-xs bg-muted px-3 py-1 rounded-full inline-block">{credential.certification}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
