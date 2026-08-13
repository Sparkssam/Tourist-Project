"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GOOGLE_REVIEW_URL } from "@/lib/constants"
import { ExternalLink, Star, MapPin, Calendar, PenLine } from "lucide-react"

const GoogleIcon = () => (
  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
  ]
  const color = colors[name.charCodeAt(0) % colors.length]

  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${color}`}>
      {initials}
    </div>
  )
}

export function ReviewsGrid() {
  const [liveReviews, setLiveReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveReviews() {
      try {
        const res = await fetch("/api/reviews")
        const data = await res.json()
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped = data.reviews.map((r: any) => ({
            id: r.id || `live-${Math.random()}`,
            name: r.name,
            location: r.location || "Verified Guest",
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recently",
            rating: r.rating || 5,
            tour: r.tour || "Tanzania Safari Experience",
            review: r.review,
            verified: true,
          }))
          setLiveReviews(mapped)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchLiveReviews()
  }, [])

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-3">Guest Experiences & Reviews</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-serif text-lg leading-relaxed">
            Honest stories from travelers who have explored Tanzania with Kekeo Safaris
          </p>
        </div>

        {loading ? (
          /* Loading skeleton */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : liveReviews.length === 0 ? (
          /* Empty state — encourages first real review */
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <PenLine className="w-9 h-9 text-primary" />
            </div>
            <h3 className="text-2xl font-luxury text-primary mb-3">Be the First to Share Your Story</h3>
            <p className="text-muted-foreground font-serif leading-relaxed mb-8">
              No reviews yet — but every great story has a first chapter. If you've traveled with Kekeo Safaris,
              your experience is the most powerful thing we can share with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                <GoogleIcon />
                <span>Leave a Google Review</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#share-your-experience"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-7 py-3.5 rounded-xl font-semibold hover:bg-primary/5 transition-all"
              >
                <PenLine className="w-4 h-4" />
                <span>Share on This Page</span>
              </a>
            </div>
          </div>
        ) : (
          /* Real reviews grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveReviews.map((review) => (
              <Card
                key={review.id}
                className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border bg-card overflow-hidden"
              >
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                <CardContent className="p-6 flex-1 flex flex-col gap-4">
                  {/* Reviewer info */}
                  <div className="flex items-start gap-3">
                    <InitialsAvatar name={review.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-card-foreground truncate">{review.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{review.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{review.date}</span>
                      </div>
                    </div>
                    {/* Verified badge */}
                    <div className="bg-white border border-gray-100 rounded-full px-2 py-1 flex items-center gap-1 shadow-xs flex-shrink-0">
                      <GoogleIcon />
                      <span className="text-xs font-semibold text-gray-600 hidden sm:inline">Verified</span>
                    </div>
                  </div>

                  {/* Stars + tour */}
                  <div className="flex items-center justify-between">
                    <StarRating rating={review.rating} />
                    <Badge variant="secondary" className="text-xs font-medium max-w-[120px] truncate">
                      {review.tour}
                    </Badge>
                  </div>

                  {/* Review text */}
                  <blockquote className="text-muted-foreground font-serif text-sm leading-relaxed flex-1 italic border-l-2 border-primary/30 pl-3">
                    "{review.review}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Google Review CTA — always shown */}
        {!loading && liveReviews.length > 0 && (
          <div className="mt-16 text-center bg-card border border-primary/20 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GoogleIcon />
            </div>
            <h3 className="text-2xl font-luxury text-primary mb-2">Traveled With Us?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-serif">
              Your honest feedback helps future adventurers plan their dream Tanzanian safari.
            </p>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              <GoogleIcon />
              <span>Write a Review on Google</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
