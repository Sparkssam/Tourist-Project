import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TourBookingForm } from "./tour-booking-form"

interface ToursGridProps {
  activeFilter: string
}

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

const StarIcon = () => (
  <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

export function ToursGrid({ activeFilter }: ToursGridProps) {
  const tours = [
    {
      id: "serengeti-ngorongoro-safari",
      title: "Serengeti & Ngorongoro Safari",
      image: "/serengeti-lions-and-wildebeest-migration.png",
      duration: "5 Days",
      groupSize: "2-8 People",
      location: "Serengeti, Ngorongoro",
      price: "From $1,200",
      rating: 4.9,
      reviews: 127,
      description:
        "Witness the Great Migration and explore the world's largest intact volcanic caldera with expert guides.",
      highlights: ["Big Five", "Migration", "Crater Views"],
      category: "Wildlife",
      minDays: 3,
      maxDays: 8,
      basePricePerPerson: 240,
    },
    {
      id: "kilimanjaro-trekking",
      title: "Kilimanjaro Trekking Adventure",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      duration: "7 Days",
      groupSize: "2-12 People",
      location: "Mount Kilimanjaro",
      price: "From $1,800",
      rating: 4.8,
      reviews: 89,
      description: "Conquer Africa's highest peak via the scenic Machame route with experienced mountain guides.",
      highlights: ["Summit Uhuru", "Machame Route", "Expert Guides"],
      category: "Adventure",
      minDays: 5,
      maxDays: 9,
      basePricePerPerson: 300,
    },
    {
      id: "maasai-cultural-experience",
      title: "Cultural Maasai Experience",
      image: "/maasai-warriors-in-traditional-dress-with-village.png",
      duration: "3 Days",
      groupSize: "2-10 People",
      location: "Maasai Villages",
      price: "From $600",
      rating: 4.9,
      reviews: 64,
      description: "Immerse yourself in authentic Maasai culture and traditional way of life in remote villages.",
      highlights: ["Village Stay", "Traditional Dance", "Craft Making"],
      category: "Culture",
      minDays: 2,
      maxDays: 5,
      basePricePerPerson: 200,
    },
    {
      id: "zanzibar-beach-extension",
      title: "Zanzibar Beach Extension",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.png",
      duration: "4 Days",
      groupSize: "2-6 People",
      location: "Zanzibar Island",
      price: "From $800",
      rating: 4.7,
      reviews: 156,
      description: "Relax on pristine beaches and explore Stone Town's rich history and aromatic spice markets.",
      highlights: ["Stone Town", "Spice Tour", "Beach Resort"],
      category: "Beach",
      minDays: 3,
      maxDays: 7,
      basePricePerPerson: 200,
    },
    {
      id: "tarangire-lake-manyara-safari",
      title: "Tarangire & Lake Manyara Safari",
      image: "/tarangire-elephants-baobab-trees.png",
      duration: "4 Days",
      groupSize: "2-8 People",
      location: "Tarangire, Lake Manyara",
      price: "From $950",
      rating: 4.8,
      reviews: 92,
      description: "Discover elephant herds and tree-climbing lions in two of Tanzania's most scenic national parks.",
      highlights: ["Elephant Herds", "Tree Lions", "Baobab Trees"],
      category: "Wildlife",
      minDays: 3,
      maxDays: 6,
      basePricePerPerson: 238,
    },
    {
      id: "ruaha-selous-wilderness",
      title: "Ruaha & Selous Wilderness",
      image: "/ruaha-wild-dogs-hunting.png",
      duration: "6 Days",
      groupSize: "2-6 People",
      location: "Ruaha, Selous",
      price: "From $1,500",
      rating: 4.9,
      reviews: 43,
      description: "Experience Tanzania's remote wilderness areas with exceptional wildlife and fewer crowds.",
      highlights: ["Wild Dogs", "Remote Wilderness", "Boat Safari"],
      category: "Wildlife",
      minDays: 4,
      maxDays: 10,
      basePricePerPerson: 250,
    },
  ]

  const filteredTours = activeFilter === "All" ? tours : tours.filter((tour) => tour.category === activeFilter)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="col-span-full">
        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tours found for the selected category.</p>
          </div>
        )}
      </div>

      {filteredTours.map((tour, index) => (
        <Card
          key={tour.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "fadeInUp 0.6s ease-out forwards",
          }}
        >
          <div className="relative">
            <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-56 object-cover" />
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">{tour.price}</Badge>
            <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">{tour.category}</Badge>
          </div>

          <CardHeader className="pb-3">
            <h3 className="text-xl font-semibold text-card-foreground text-balance">{tour.title}</h3>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <StarIcon />
                <span className="ml-1 text-sm font-medium">{tour.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({tour.reviews} reviews)</span>
            </div>

            {/* Tour Details */}
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
            <p className="text-muted-foreground mb-4 text-pretty text-lg font-serif">{tour.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {tour.highlights.map((highlight, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/tours/${tour.id}`}>View Details</Link>
              </Button>
            </div>

            <TourBookingForm
              tour={{
                id: tour.id,
                title: tour.title,
                minDays: tour.minDays,
                maxDays: tour.maxDays,
                basePricePerPerson: tour.basePricePerPerson,
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
