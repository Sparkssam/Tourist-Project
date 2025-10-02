import { Card, CardContent } from "@/components/ui/card"

export function OurStory() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center font-serif text-lg">
          <div>
            <h2 className="text-4xl font-luxury text-primary mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-pretty">
                KEKEOsafaris was born from a deep passion for Tanzania's incredible wildlife and landscapes. Founded in
                2015 by Samuel Suya, a local Tanzanian guide with over 15 years of experience, our company started with
                a simple mission: to share the magic of East Africa with travelers from around the world.
              </p>
              <p className="text-pretty">
                What began as small group tours has grown into one of Tanzania's most trusted safari operators, but
                we've never lost sight of our core values: authentic experiences, sustainable tourism, and genuine
                connections between our guests and the local communities.
              </p>
              <p className="text-pretty">
                Today, we're proud to have guided thousands of adventurers through the Serengeti, up Mount Kilimanjaro,
                and across the stunning landscapes of Tanzania, creating memories that last a lifetime.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Our Mission</h3>
                <p className="text-muted-foreground text-pretty">
                  To provide exceptional, authentic safari experiences while supporting local communities and
                  conservation efforts across Tanzania.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Our Vision</h3>
                <p className="text-muted-foreground text-pretty">
                  To be East Africa's leading sustainable tourism operator, creating positive impact for wildlife,
                  communities, and travelers alike.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">Our Values</h3>
                <p className="text-muted-foreground text-pretty">
                  Authenticity, sustainability, respect for local cultures, and an unwavering commitment to creating
                  extraordinary experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
