"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const StarIcon = () => (
  <svg className="h-6 w-6 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

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

const GoogleVerifiedBadge = () => (
  <div className="inline-flex items-center gap-1 bg-white/95 rounded-full px-3 py-1 shadow-sm">
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
    <span className="text-xs font-medium text-gray-700">Google Verified</span>
  </div>
)

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref, isVisible } = useScrollAnimation()

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      text: "KEKEOsafari's provided the most incredible safari experience! Our guide was knowledgeable and we saw all the Big Five. The accommodations were perfect and the cultural visit was truly authentic.",
      avatar: "/woman-smiling-safari-hat.png",
      verified: true,
      visitDate: "March 2024",
      tourName: "5-Day Serengeti Safari",
    },
    {
      name: "Marcus Weber",
      location: "Berlin, Germany",
      rating: 5,
      text: "Outstanding service from start to finish. The Kilimanjaro trek was challenging but our guides made it safe and enjoyable. The wildlife photography opportunities were endless!",
      avatar: "/man-hiking-gear-mountain.jpeg",
      verified: true,
      visitDate: "April 2024",
      tourName: "7-Day Kilimanjaro Trek",
    },
    {
      name: "Emma Thompson",
      location: "London, UK",
      rating: 5,
      text: "A life-changing experience! The Maasai cultural tour opened our eyes to a beautiful way of life. The safari was expertly organized and we felt completely safe throughout.",
      avatar: "/woman-cultural-dress-smiling.jpeg",
      verified: true,
      visitDate: "May 2024",
      tourName: "3-Day Maasai Cultural Tour",
    },
    {
      name: "David Chen",
      location: "Sydney, Australia",
      rating: 5,
      text: "Best safari company in Tanzania! Professional, reliable, and passionate about wildlife conservation. The Serengeti migration was absolutely breathtaking.",
      avatar: "/man-binoculars-safari-vest.jpeg",
      verified: true,
      visitDate: "June 2024",
      tourName: "10-Day Serengeti Migration Safari",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
      setTimeout(() => setIsAnimating(false), 600)
    }
  }

  return (
    <section ref={ref} className="py-24 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-4">
            <GoogleVerifiedBadge />
          </div>

          <h2 className="text-responsive-lg font-luxury text-primary mb-6">What Our Travelers Say</h2>
          <p className="text-responsive-md text-muted-foreground text-pretty font-light font-serif">
            Real experiences from adventurers who've explored Tanzania with us
          </p>

          <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto">
            These reviews are sourced directly from Google and reflect genuine guest experiences, unedited and
            transparent.
          </p>
        </div>

        <div className={`relative transition-all duration-1000 ${isVisible ? "scale-up" : "opacity-0 scale-90"}`}>
          <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-500">
            <CardContent
              className={`p-6 md:p-12 transition-all duration-600 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              <div className="absolute top-4 right-4">
                <GoogleVerifiedBadge />
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                <blockquote className="text-lg md:text-xl text-card-foreground mb-8 text-pretty">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                    />
                    <AvatarFallback>
                      {testimonials[currentIndex].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-card-foreground">{testimonials[currentIndex].name}</div>
                    <div className="text-muted-foreground">{testimonials[currentIndex].location}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].visitDate} • {testimonials[currentIndex].tourName}
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.google.com/search?q=kekeosafaris+tanzania+reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View on Google Reviews →
                </a>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            size="sm"
            className="absolute -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 bg-background shadow-lg hover:scale-110 button-press transition-all duration-300"
            onClick={prevTestimonial}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 rounded-full p-3 bg-background shadow-lg hover:scale-110 button-press transition-all duration-300"
            onClick={nextTestimonial}
          >
            <ChevronRightIcon />
          </Button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted-foreground/30"
                }`}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setCurrentIndex(index)
                    setTimeout(() => setIsAnimating(false), 600)
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div
          className={`mt-12 text-center transition-all duration-1000 delay-300 ${isVisible ? "fade-in-up" : "opacity-0 translate-y-10"}`}
        >
          <p className="text-muted-foreground mb-4">
            Traveled with us recently? Your honest feedback helps future adventurers.
          </p>
          <a
            href="https://www.google.com/search?q=kekeosafaris+tanzania+review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 button-press hover:scale-105 transition-all duration-300"
          >
            Leave a Review on Google
          </a>
        </div>
      </div>
    </section>
  )
}
