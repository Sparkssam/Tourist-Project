"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const DollarSignIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export default function InquiryPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    country: "",

    // Tour Preferences
    selectedTour: "",
    alternativeTours: [] as string[],
    travelMonth: "",
    travelYear: "",
    flexibility: "flexible",

    // Group Details
    adults: "2",
    children: "0",
    childrenAges: "",

    // Accommodation Style
    accommodationStyle: "mid-range",

    // Special Interests (multiple selection)
    interests: {
      wildlife: false,
      photography: false,
      birdwatching: false,
      culture: false,
      adventure: false,
      relaxation: false,
    },

    // Additional Details
    dietaryRequirements: "",
    specialRequests: "",
    budget: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    const tourId = searchParams.get("tour")
    if (tourId) {
      setFormData((prev) => ({ ...prev, selectedTour: tourId }))
    }
  }, [searchParams.get("tour")])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "",
          selectedTour: "",
          alternativeTours: [],
          travelMonth: "",
          travelYear: "",
          flexibility: "flexible",
          adults: "2",
          children: "0",
          childrenAges: "",
          accommodationStyle: "mid-range",
          interests: {
            wildlife: false,
            photography: false,
            birdwatching: false,
            culture: false,
            adventure: false,
            relaxation: false,
          },
          dietaryRequirements: "",
          specialRequests: "",
          budget: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
      }
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const tours = [
    { id: "serengeti-ngorongoro-safari", name: "Serengeti & Ngorongoro Safari" },
    { id: "kilimanjaro-trekking-adventure", name: "Kilimanjaro Summit Experience" },
    { id: "cultural-maasai-experience", name: "Cultural Maasai Immersion" },
    { id: "zanzibar-beach-extension", name: "Zanzibar Island Escape" },
    { id: "tarangire-lake-manyara-safari", name: "Tarangire & Lake Manyara Journey" },
    { id: "ruaha-selous-wilderness", name: "Remote Wilderness Explorer" },
    { id: "arusha-national-park-day-trip", name: "Arusha National Park Discovery" },
    { id: "lake-natron-flamingo-safari", name: "Lake Natron Flamingo Spectacle" },
    { id: "mikumi-national-park-safari", name: "Mikumi Wildlife Encounter" },
    { id: "northern-circuit-grand-safari", name: "Grand Northern Circuit" },
    { id: "mafia-island-diving-adventure", name: "Mafia Island Marine Safari" },
    { id: "usambara-mountains-trekking", name: "Usambara Mountains Trek" },
  ]

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Begin Your Safari Journey</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Share your travel vision with us. Every safari is unique, crafted around your interests, pace, and dreams.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-primary">Your Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country of Residence</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Your country"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Tour Selection Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Your Safari Preference</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="selectedTour">Preferred Route *</Label>
                    <Select
                      value={formData.selectedTour}
                      onValueChange={(value) => setFormData({ ...formData, selectedTour: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your preferred safari route" />
                      </SelectTrigger>
                      <SelectContent>
                        {tours.map((tour) => (
                          <SelectItem key={tour.id} value={tour.id}>
                            {tour.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Travel Dates Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">When Would You Like to Travel?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="travelMonth">Preferred Month</Label>
                    <Select
                      value={formData.travelMonth}
                      onValueChange={(value) => setFormData({ ...formData, travelMonth: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month.toLowerCase()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="travelYear">Year</Label>
                    <Select
                      value={formData.travelYear}
                      onValueChange={(value) => setFormData({ ...formData, travelYear: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date Flexibility</Label>
                    <RadioGroup
                      value={formData.flexibility}
                      onValueChange={(value) => setFormData({ ...formData, flexibility: value })}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="flexible" />
                        <Label htmlFor="flexible" className="font-normal cursor-pointer">
                          Flexible dates
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed" className="font-normal cursor-pointer">
                          Fixed dates
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Group Details Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Who's Traveling?</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="adults">Number of Adults *</Label>
                    <Select
                      value={formData.adults}
                      onValueChange={(value) => setFormData({ ...formData, adults: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Adult" : "Adults"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="children">Number of Children</Label>
                    <Select
                      value={formData.children}
                      onValueChange={(value) => setFormData({ ...formData, children: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Child" : "Children"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.children !== "0" && (
                    <div>
                      <Label htmlFor="childrenAges">Children's Ages</Label>
                      <Input
                        id="childrenAges"
                        value={formData.childrenAges}
                        onChange={(e) => setFormData({ ...formData, childrenAges: e.target.value })}
                        placeholder="e.g., 5, 8, 12"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Accommodation Style Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Accommodation Preference</h2>
                <RadioGroup
                  value={formData.accommodationStyle}
                  onValueChange={(value) => setFormData({ ...formData, accommodationStyle: value })}
                  className="space-y-4"
                >
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="budget" id="budget" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="budget" className="font-semibold cursor-pointer">
                        Budget Camping
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">Basic tented camps with shared facilities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="mid-range" id="mid-range" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="mid-range" className="font-semibold cursor-pointer">
                        Mid-Range Lodges
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">Comfortable lodges with private facilities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="luxury" id="luxury" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="luxury" className="font-semibold cursor-pointer">
                        Luxury Safari Camps
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">Premium tented camps with full amenities</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Special Interests Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Your Safari Interests</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries({
                    wildlife: "Wildlife Viewing",
                    photography: "Photography",
                    birdwatching: "Bird Watching",
                    culture: "Cultural Experiences",
                    adventure: "Adventure Activities",
                    relaxation: "Beach & Relaxation",
                  }).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={key}
                        checked={formData.interests[key as keyof typeof formData.interests]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            interests: { ...formData.interests, [key]: checked },
                          })
                        }
                      />
                      <Label htmlFor={key} className="cursor-pointer flex-1">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="border-t pt-10">
                <h2 className="text-2xl font-semibold mb-6 text-primary">Additional Details</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="budget">Approximate Budget (USD)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g., $3000 - $5000 per person"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Optional - helps us tailor your safari</p>
                  </div>
                  <div>
                    <Label htmlFor="dietaryRequirements">Dietary Requirements or Allergies</Label>
                    <Input
                      id="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                      placeholder="Vegetarian, gluten-free, allergies, etc."
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Tell Us More About Your Dream Safari</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share any special requests, celebration occasions, accessibility needs, or specific wildlife you hope to see..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Status Messages */}
              {submitStatus === "success" && (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
                  <h3 className="font-semibold text-lg mb-2">Enquiry Received!</h3>
                  <p>
                    Thank you for reaching out. Our safari experts will craft a personalized itinerary and contact you
                    within 24 hours.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
                  <h3 className="font-semibold text-lg mb-2">Something Went Wrong</h3>
                  <p>
                    We couldn't submit your enquiry. Please try again or contact us directly at info@kekoosafaris.com
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="border-t pt-10">
                <Button type="submit" size="lg" className="w-full md:w-auto px-12 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending Your Enquiry...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  By submitting, you agree to receive personalized safari proposals. We respect your privacy and never
                  share your information.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
