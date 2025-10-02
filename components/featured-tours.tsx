import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export function FeaturedTours() {
  const tours = [
    {
      id: "serengeti-ngorongoro-safari",
      title: "Serengeti & Ngorongoro Safari",
      image: "/serengeti-lions-and-wildebeest-migration.png",
      duration: "5 Days",
      groupSize: "2-8 People",
      location: "Serengeti, Ngorongoro",
      price: "From $1,200",
      description: "Witness the Great Migration and explore the world's largest intact volcanic caldera.",
      highlights: ["Big Five", "Migration", "Crater Views"],
    },
    {
      id: "kilimanjaro-trekking-adventure",
      title: "Kilimanjaro Trekking Adventure",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      duration: "7 Days",
      groupSize: "2-12 People",
      location: "Mount Kilimanjaro",
      price: "From $1,800",
      description: "Conquer Africa's highest peak via the scenic Machame route with expert guides.",
      highlights: ["Summit Uhuru", "Machame Route", "Expert Guides"],
    },
    {
      id: "cultural-maasai-experience",
      title: "Cultural Maasai Experience",
      image: "/maasai-warriors-in-traditional-dress-with-village.png",
      duration: "3 Days",
      groupSize: "2-10 People",
      location: "Maasai Villages",
      price: "From $600",
      description: "Immerse yourself in authentic Maasai culture and traditional way of life.",
      highlights: ["Village Stay", "Traditional Dance", "Craft Making"],
    },
    {
      id: "zanzibar-beach-extension",
      title: "Zanzibar Beach Extension",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.png",
      duration: "4 Days",
      groupSize: "2-6 People",
      location: "Zanzibar Island",
      price: "From $800",
      description: "Relax on pristine beaches and explore Stone Town's rich history and spice markets.",
      highlights: ["Stone Town", "Spice Tour", "Beach Resort"],
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-luxury text-primary mb-6">Featured Safari Adventures</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-serif">
            Discover our most popular safari packages, carefully crafted to showcase Tanzania's incredible wildlife and
            cultural heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tours.map((tour, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{tour.price}</Badge>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold text-card-foreground text-balance">{tour.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <ClockIcon />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UsersIcon />
                    <span>{tour.groupSize}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPinIcon />
                  <span>{tour.location}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 text-pretty font-serif">{tour.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href={`/tours/${tour.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="px-8">
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
