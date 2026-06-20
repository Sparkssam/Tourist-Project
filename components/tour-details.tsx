"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Star, Check, X, Play } from "lucide-react"

interface TourDetailsProps {
  tour: {
    title: string
    duration: string
    groupSize: string
    location: string
    price: string
    rating: number
    reviews: number
    images: string[]
    description: string
    highlights: string[]
    itinerary: Array<{
      day: number
      title: string
      description: string
    }>
    included: string[]
    excluded: string[]
  }
}

export function TourDetails({ tour }: TourDetailsProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-luxury text-primary mb-4">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-5 w-5" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-5 w-5" />
              <span>{tour.groupSize}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5" />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span>
                {tour.rating} ({tour.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={tour.images[activeImage] || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
              <div className="flex space-x-4 overflow-x-auto">
                {tour.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${tour.title} ${index + 1}`}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                      activeImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Safari</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-pretty">{tour.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Day-by-Day Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {day.day}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground mb-1">{day.title}</h4>
                        <p className="text-muted-foreground text-pretty">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Included/Excluded */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tour.included.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">What's Not Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl font-bold text-primary">{tour.price}</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                  <Badge variant="secondary">Best Seller</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  Book This Safari
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  Request Custom Quote
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Free cancellation up to 48 hours before departure
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
