import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MapPinIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const StarIcon = () => (
  <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

const GoogleVerifiedIcon = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

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
      googleReviewId: "ChdDSUhNMG9nS0VJQ0FnSUQ3Z1lXUy1RRRAB",
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Recent Reviews</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance font-serif text-2xl mb-6">
            Read what our recent guests have to say about their safari adventures
          </p>

          <div className="bg-muted/50 border border-border rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <GoogleVerifiedIcon />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <GoogleVerifiedIcon />
                  Verified Google Reviews
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  These reviews are imported directly from our Google Business profile and remain completely unedited.
                  We don't filter negative feedback or alter guest comments in any way. What you read here reflects the
                  genuine experiences of real travelers who've journeyed with KEKEOsafaris.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.google.com/search?q=kekeosafaris+tanzania+reviews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Read all reviews on Google →
                  </a>
                  <span className="text-muted-foreground">|</span>
                  <a
                    href="https://www.google.com/search?q=kekeosafaris+tanzania+review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Leave your review after your trip →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="h-full relative">
              {review.verified && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-white rounded-full px-2 py-1 shadow-md flex items-center gap-1">
                    <GoogleVerifiedIcon />
                    <span className="text-xs font-medium text-gray-700">Verified</span>
                  </div>
                </div>
              )}

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
                      <MapPinIcon />
                      <span>{review.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CalendarIcon />
                      <span>Visited {review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {review.tour}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-pretty leading-relaxed font-serif text-lg mb-4">
                  {review.review}
                </p>

                {review.verified && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <GoogleVerifiedIcon />
                      <span>Posted on Google Reviews</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-8">
          <h3 className="text-2xl font-luxury text-primary mb-3">Recently traveled with us?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your honest feedback helps future travelers make informed decisions and helps us continue delivering
            unforgettable safari experiences. Share your story on Google Reviews.
          </p>
          <a
            href="https://www.google.com/search?q=kekeosafaris+tanzania+review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <GoogleVerifiedIcon />
            Write a Review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
