import { Card, CardContent } from "@/components/ui/card"
import { Star, Users, Award, Heart } from "lucide-react"

export function ReviewStats() {
  const stats = [
    {
      icon: Star,
      value: "4.9",
      label: "Average Rating",
      description: "Based on 500+ reviews",
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Happy Travelers",
      description: "Since 2015",
    },
    {
      icon: Award,
      value: "98%",
      label: "Satisfaction Rate",
      description: "Would recommend us",
    },
    {
      icon: Heart,
      value: "100%",
      label: "Memorable Experiences",
      description: "Guaranteed adventures",
    },
  ]

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Trusted by Thousands</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance font-serif text-2xl">
            Our commitment to excellence shows in every review and every adventure we create
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="font-semibold text-card-foreground mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
