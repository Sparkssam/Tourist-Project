import { Card, CardContent } from "@/components/ui/card"

export function OurStory() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-luxury text-primary mb-4">Our Story</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Born from passion, guided by purpose, committed to conservation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Story Image */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/african-safari-guide-with-binoculars-in-tanzania-w.jpeg"
              alt="KEKEOsafari's founder Samuel Msuya on safari"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-2xl font-luxury mb-2">Elibariki Basso</p>
              <p className="text-sm opacity-90">Founder & Lead Safari Guide</p>
            </div>
          </div>

          {/* Story Text */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-foreground">
              KEKEOsafari's was born from a deep passion for Tanzania's incredible wildlife and landscapes. Founded in
              2015 by Samuel Msuya, a local Tanzanian guide with over 15 years of experience, our company started with a
              simple mission: to share the magic of East Africa with travelers from around the world.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              What began as small group tours has grown into one of Tanzania's most trusted safari operators, but we've
              never lost sight of our core values: authentic experiences, sustainable tourism, and genuine connections
              between our guests and the local communities.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Today, we're proud to have guided thousands of adventurers through the Serengeti, up Mount Kilimanjaro,
              and across the stunning landscapes of Tanzania, creating memories that last a lifetime.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide exceptional, authentic safari experiences while supporting local communities and conservation
                efforts across Tanzania.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be East Africa's leading sustainable tourism operator, creating positive impact for wildlife,
                communities, and travelers alike.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                Authenticity, sustainability, respect for local cultures, and an unwavering commitment to creating
                extraordinary experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
