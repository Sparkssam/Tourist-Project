import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Award, Users, Leaf } from "lucide-react"

export function WhyChooseUs() {
  const features = [
    {
      icon: Shield,
      title: "Licensed & Insured",
      description: "Fully licensed tour operator with comprehensive insurance coverage for your peace of mind.",
      badge: "Certified",
    },
    {
      icon: Award,
      title: "Expert Local Guides",
      description: "Our experienced guides are born and raised in Tanzania, offering authentic cultural insights.",
      badge: "15+ Years",
    },
    {
      icon: Users,
      title: "Small Group Tours",
      description: "Intimate group sizes ensure personalized attention and better wildlife viewing opportunities.",
      badge: "Max 8 People",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Tourism",
      description: "Committed to sustainable tourism practices that protect wildlife and support local communities.",
      badge: "Sustainable",
    },
  ]

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-luxury text-primary mb-6">Brilliant Reasons to Travel with Us</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            With over 15 years of experience in African safari tourism, we provide authentic, safe, and unforgettable
            adventures that respect both wildlife and local communities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <Badge variant="secondary" className="mb-4">
                  {feature.badge}
                </Badge>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-pretty font-serif">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by travelers worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold">TripAdvisor</div>
            <div className="text-2xl font-bold">SafariBookings</div>
            <div className="text-2xl font-bold">Tanzania Tourism</div>
          </div>
        </div>
      </div>
    </section>
  )
}
