"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Review {
  id: string
  name: string
  email: string
  location?: string
  tour?: string
  rating: number
  review: string
  status: string
  created_at: string
  approved_at?: string
}

export function ReviewsGrid() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentReviews()
  }, [])

  const fetchRecentReviews = async () => {
    try {
      setLoading(true)
      // Fetch only approved reviews, ordered by approval date (most recent first), limit to 6
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching reviews:', error)
      } else {
        setReviews(data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-luxury text-primary mb-4">Recent Reviews</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-balance font-serif text-2xl">
            Read what our recent guests have to say about their safari adventures
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-card-foreground">{review.name}</h4>
                      {review.location && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{review.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(review.approved_at || review.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {review.tour && (
                      <Badge variant="secondary" className="text-xs">
                        {review.tour}
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground text-pretty leading-relaxed font-serif text-lg">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
