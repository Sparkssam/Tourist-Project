import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar } from "lucide-react"

export function ReviewsGrid() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "New York, USA",
      date: "March 2024",
      rating: 5,
      tour: "5-Day Serengeti Safari",
      review:
        "Absolutely incredible experience! Samuel and his team made our dream safari come true. We saw all of the Big Five and the Great Migration was breathtaking. The accommodations were perfect and the guides were so knowledgeable. Can't wait to come back!",
      avatar: "/sarah-johnson-review.png",
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Sydney, Australia",
      date: "February 2024",
      rating: 5,
      tour: "Kilimanjaro Climb + Safari",
      review:
        "KEKEOsafaris exceeded all expectations. The Kilimanjaro climb was challenging but well-organized, and the safari afterwards was the perfect way to celebrate reaching the summit. Professional, friendly, and truly passionate about what they do.",
      avatar: "/michael-chen-review.png",
    },
    {
      id: 3,
      name: "Emma Thompson",
      location: "London, UK",
      date: "January 2024",
      rating: 5,
      tour: "Cultural & Wildlife Tour",
      review:
        "The cultural experiences with the Maasai community were authentic and respectful. Maria was an amazing guide who helped us understand the local traditions. The wildlife viewing was spectacular too. Highly recommend!",
      avatar: "/emma-thompson-review.png",
    },
    {
      id: 4,
      name: "David Rodriguez",
      location: "Madrid, Spain",
      date: "December 2023",
      rating: 5,
      tour: "Ngorongoro Crater Safari",
      review:
        "The Ngorongoro Crater is truly the 8th wonder of the world, and KEKEOsafaris showed us every corner of it. Joseph's expertise in spotting wildlife is unmatched. Saw lions, elephants, and even a rare black rhino!",
      avatar: "/david-rodriguez-review.png",
    },
    {
      id: 5,
      name: "Lisa Wang",
      location: "Toronto, Canada",
      date: "November 2023",
      rating: 5,
      tour: "Photography Safari",
      review:
        "As a photographer, I needed guides who understood my needs. Samuel's knowledge of animal behavior and the best lighting conditions helped me capture once-in-a-lifetime shots. The itinerary was perfectly planned.",
      avatar: "/lisa-wang-review.png",
    },
    {
      id: 6,
      name: "James Mitchell",
      location: "Melbourne, Australia",
      date: "October 2023",
      rating: 5,
      tour: "Family Safari Adventure",
      review:
        "Traveling with kids can be challenging, but KEKEOsafaris made it seamless. The guides were patient and engaging with our children, making it educational and fun. Our 8-year-old is still talking about the lions!",
      avatar: "/james-mitchell-review.png",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Recent Reviews</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance font-serif text-2xl">
            Read what our recent guests have to say about their safari adventures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground">{review.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{review.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {review.tour}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-pretty leading-relaxed font-serif text-lg">{review.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
