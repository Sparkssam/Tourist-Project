import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
  const tours = getAllTours()

  const filteredTours = activeFilter === "All" ? tours : tours.filter((tour) => tour.category === activeFilter)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {filteredTours.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground text-lg">No routes found for the selected category.</p>
        </div>
      )}

      {filteredTours.map((tour, index) => (
        <Card
          key={tour.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card group"
          style={{
            animationName: "fadeInUp",
            animationDuration: "0.6s",
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="relative overflow-hidden">
            <img
              src={tour.image || "/placeholder.svg"}
              alt={tour.title}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground text-base px-4 py-2 shadow-lg">
              {tour.duration}
            </Badge>
          </div>

          <CardHeader className="pb-3 space-y-3">
            <h3 className="text-2xl font-semibold text-card-foreground text-balance leading-tight">{tour.title}</h3>

            <p className="text-muted-foreground text-base leading-relaxed text-pretty">{tour.highlight}</p>
          </CardHeader>

          <CardContent className="pt-0 space-y-5">
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <MapPinIcon />
              <span className="leading-relaxed">{tour.itineraries}</span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-border">
              <div>
                {tour.priceOnEnquiry ? (
                  <p className="text-lg font-medium text-primary">Price on Enquiry</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Starting from</p>
                    <p className="text-2xl font-bold text-primary">${tour.startingPrice}</p>
                  </>
                )}
              </div>
            </div>

            <Button asChild className="w-full" size="lg">
              <Link href={`/inquiry?tour=${tour.id}`}>Enquiry</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function getAllTours() {
  return [
    {
      id: "serengeti-ngorongoro-safari",
      title: "Serengeti & Ngorongoro Safari",
      image: "/serengeti-lions-and-wildebeest-migration.png",
      duration: "5 Days",
      itineraries: "Serengeti • Ngorongoro Crater • Lake Manyara",
      highlight: "Witness the Great Migration and explore Africa's wildlife paradise",
      startingPrice: 1200,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "kilimanjaro-trekking-adventure",
      title: "Kilimanjaro Summit Experience",
      image: "/mount-kilimanjaro-snow-peak-with-hikers.png",
      duration: "7 Days",
      itineraries: "Mount Kilimanjaro • Machame Route • Rainforest Zones",
      highlight: "Conquer Africa's highest peak with expert mountain guides",
      startingPrice: 1800,
      priceOnEnquiry: false,
      category: "Adventure",
    },
    {
      id: "cultural-maasai-experience",
      title: "Cultural Maasai Immersion",
      image: "/maasai-warriors-in-traditional-dress-with-village.png",
      duration: "3 Days",
      itineraries: "Maasai Villages • Ngorongoro Highlands • Cultural Sites",
      highlight: "Live alongside Maasai communities in authentic cultural exchange",
      startingPrice: 600,
      priceOnEnquiry: false,
      category: "Culture",
    },
    {
      id: "zanzibar-beach-extension",
      title: "Zanzibar Island Escape",
      image: "/zanzibar-white-sand-beach-with-dhow-boats.png",
      duration: "4 Days",
      itineraries: "Stone Town • Spice Plantations • Pristine Beaches",
      highlight: "Unwind on powder-white sands after your safari adventure",
      startingPrice: 800,
      priceOnEnquiry: false,
      category: "Beach",
    },
    {
      id: "tarangire-lake-manyara-safari",
      title: "Tarangire & Lake Manyara Journey",
      image: "/tarangire-elephants-baobab-trees.png",
      duration: "4 Days",
      itineraries: "Tarangire National Park • Lake Manyara • Rift Valley",
      highlight: "Discover elephant herds beneath ancient baobab trees",
      startingPrice: 950,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "ruaha-selous-wilderness",
      title: "Remote Wilderness Explorer",
      image: "/ruaha-wild-dogs-hunting.png",
      duration: "6 Days",
      itineraries: "Ruaha National Park • Selous Game Reserve • Wild Landscapes",
      highlight: "Experience untouched wilderness far from tourist trails",
      startingPrice: 1500,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "arusha-national-park-day-trip",
      title: "Arusha National Park Discovery",
      image: "/arusha-tanzania-city-skyline-with-mount-meru-backg.jpg",
      duration: "1 Day",
      itineraries: "Arusha National Park • Mount Meru • Momella Lakes",
      highlight: "Perfect introduction to Tanzania's diverse ecosystems",
      startingPrice: 180,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "lake-natron-flamingo-safari",
      title: "Lake Natron Flamingo Spectacle",
      image: "/lake-natron-flamingos-tanzania.jpg",
      duration: "3 Days",
      itineraries: "Lake Natron • Oldonyo Lengai Volcano • Flamingo Colonies",
      highlight: "Witness millions of flamingos at their only breeding ground",
      startingPrice: 750,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "mikumi-national-park-safari",
      title: "Mikumi Wildlife Encounter",
      image: "/mikumi-national-park-elephants-tanzania.jpg",
      duration: "3 Days",
      itineraries: "Mikumi National Park • Uluguru Mountains • Baobab Plains",
      highlight: "Explore Tanzania's accessible wildlife haven near Dar es Salaam",
      startingPrice: 680,
      priceOnEnquiry: false,
      category: "Wildlife",
    },
    {
      id: "northern-circuit-grand-safari",
      title: "Grand Northern Circuit",
      image: "/tanzania-safari-leopard-tree.jpg",
      duration: "10 Days",
      itineraries: "Serengeti • Ngorongoro • Tarangire • Lake Manyara",
      highlight: "The ultimate Tanzania safari covering all iconic parks",
      priceOnEnquiry: true,
      category: "Wildlife",
    },
    {
      id: "mafia-island-diving-adventure",
      title: "Mafia Island Marine Safari",
      image: "/mafia-island-diving-whale-shark-tanzania.jpg",
      duration: "5 Days",
      itineraries: "Mafia Island Marine Park • Coral Reefs • Whale Shark Sites",
      highlight: "Swim with whale sharks in pristine underwater paradise",
      startingPrice: 1100,
      priceOnEnquiry: false,
      category: "Beach",
    },
    {
      id: "usambara-mountains-trekking",
      title: "Usambara Mountains Trek",
      image: "/usambara-mountains-hiking-tanzania-villages.jpg",
      duration: "4 Days",
      itineraries: "Usambara Mountains • Traditional Villages • Cloud Forests",
      highlight: "Trek through misty highlands and connect with local communities",
      startingPrice: 590,
      priceOnEnquiry: false,
      category: "Adventure",
    },
  ]
}
