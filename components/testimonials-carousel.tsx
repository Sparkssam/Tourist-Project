"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { GOOGLE_REVIEW_URL } from "@/lib/constants"
import { Star, PenLine, ExternalLink } from "lucide-react"

const ChevronLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6" />
  </svg>
)

const GoogleIcon = () => (
  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, isVisible } = useScrollAnimation()

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews")
        const data = await res.json()
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped = data.reviews.slice(0, 6).map((r: any) => ({
            name: r.name,
            location: r.location || "Verified Traveler",
            rating: r.rating || 5,
            text: r.review,
            visitDate: r.created_at
              ? new Date(r.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : "Recently",
            tourName: r.tour || "Tanzania Safari Experience",
          }))
          setTestimonials(mapped)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    if (testimonials.length < 2) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    if (!isAnimating && testimonials.length > 1) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const prevTestimonial = () => {
    if (!isAnimating && testimonials.length > 1) {
      setIsAnimating(true)
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  return (
    <section ref={ref} className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 bg-white/95 border border-gray-100 rounded-full px-4 py-2 shadow-sm mb-4">
            <GoogleIcon />
            <span className="text-sm font-semibold text-gray-700">Google Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-luxury text-primary mb-4">What Our Travelers Say</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light font-serif">
            Real experiences from adventurers who've explored Tanzania with us
          </p>
        </div>

        {loading ? (
          <div className="bg-card border border-border rounded-2xl p-10 animate-pulse space-y-4 text-center">
            <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-4 bg-muted rounded w-2/3 mx-auto" />
          </div>
        ) : testimonials.length === 0 ? (
          /* Empty state */
          <div className={`transition-all duration-1000 ${isVisible ? "scale-up" : "opacity-0 scale-90"}`}>
            <Card className="overflow-hidden">
              <CardContent className="p-10 md:p-16 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <PenLine className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-luxury text-primary mb-2">Your Story Could Be First</h3>
                  <p className="text-muted-foreground font-serif leading-relaxed max-w-md mx-auto">
                    We're just getting started collecting our guests' adventures. If you've traveled with us, your words mean everything.
                  </p>
                </div>
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-7 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:scale-105"
                >
                  <GoogleIcon />
                  <span>Leave the First Review</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className={`relative transition-all duration-1000 ${isVisible ? "scale-up" : "opacity-0 scale-90"}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                <div className="h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
                <CardContent className={`p-6 md:p-12 transition-all duration-500 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                  <div className="text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg md:text-xl text-card-foreground mb-8 font-serif italic leading-relaxed text-pretty">
                      "{testimonials[currentIndex].text}"
                    </blockquote>

                    {/* Reviewer */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {testimonials[currentIndex].name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="font-bold text-card-foreground">{testimonials[currentIndex].name}</div>
                        <div className="text-sm text-muted-foreground">{testimonials[currentIndex].location}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {testimonials[currentIndex].visitDate} · {testimonials[currentIndex].tourName}
                        </div>
                      </div>
                    </div>

                    <a
                      href={GOOGLE_REVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                    >
                      <GoogleIcon />
                      View on Google Reviews →
                    </a>
                  </div>
                </CardContent>
              </Card>

              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 rounded-full p-3 bg-background shadow-lg hover:scale-110 button-press transition-all duration-300"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 rounded-full p-3 bg-background shadow-lg hover:scale-110 button-press transition-all duration-300"
                    onClick={nextTestimonial}
                  >
                    <ChevronRightIcon />
                  </Button>
                </>
              )}

              {testimonials.length > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${index === currentIndex ? "bg-primary w-8" : "w-2.5 bg-muted-foreground/30"}`}
                      onClick={() => { if (!isAnimating) { setIsAnimating(true); setCurrentIndex(index); setTimeout(() => setIsAnimating(false), 600) } }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className={`mt-12 text-center transition-all duration-1000 delay-300 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}>
              <p className="text-muted-foreground mb-4 font-serif">
                Traveled with us recently? Your honest feedback helps future adventurers.
              </p>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 button-press hover:scale-105 transition-all duration-300 shadow-md"
              >
                <GoogleIcon />
                Write a Review on Google
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
