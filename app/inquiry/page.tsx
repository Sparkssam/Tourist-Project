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
import { useState, useEffect, Suspense } from "react"
import { Calendar, Users, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

function InquiryFormContent() {
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    country: "",
    nationality: "",

    // Tour Preferences
    selectedTour: "",

    // Travel Dates (Exact Date Range)
    travelDateFrom: "",
    travelDateTo: "",
    flexibility: "flexible",

    // Group Details
    adults: "2",
    children: "0",
    childrenAges: "",

    // Accommodation Style
    accommodationStyle: "mid-range",

    // Special Interests (multiple selection)
    interests: {
      wildlife: true,
      photography: false,
      birdwatching: false,
      culture: false,
      adventure: false,
      relaxation: false,
    },

    // Additional Details
    budget: "",
    dietaryRequirements: "",
    specialOccasion: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const tourId = searchParams.get("tour")
    if (tourId) {
      setFormData((prev) => ({ ...prev, selectedTour: tourId }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    // Format interests list
    const selectedInterests = Object.entries(formData.interests)
      .filter(([_, val]) => val)
      .map(([key]) => key)
      .join(", ")

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      nationality: formData.nationality,
      selectedTour: formData.selectedTour || "General Safari Enquiry",
      travelDates: formData.travelDateFrom && formData.travelDateTo 
        ? `${formData.travelDateFrom} to ${formData.travelDateTo} (${formData.flexibility})`
        : `Flexibility: ${formData.flexibility}`,
      travelDateFrom: formData.travelDateFrom,
      travelDateTo: formData.travelDateTo,
      flexibility: formData.flexibility,
      groupSize: `${formData.adults} Adults${Number(formData.children) > 0 ? `, ${formData.children} Children` : ""}`,
      adults: formData.adults,
      children: formData.children,
      childrenAges: formData.childrenAges,
      accommodation: formData.accommodationStyle,
      budget: formData.budget,
      interests: selectedInterests,
      dietary: formData.dietaryRequirements,
      specialOccasion: formData.specialOccasion,
      message: formData.message,
      subject: `Safari Enquiry — ${formData.selectedTour || "General"} — ${formData.name}`,
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
      } else {
        setSubmitStatus("error")
        setErrorMessage(data?.error || data?.details || "Failed to submit enquiry. Please try again.")
      }
    } catch (error: any) {
      setSubmitStatus("error")
      setErrorMessage(error?.message || "Network error. Please check your connection and try again.")
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
    { id: "custom-tailored-safari", name: "Custom Tailored Safari / Other" },
  ]

  // Calculate trip duration dynamically if exact dates are selected
  const tripDays = formData.travelDateFrom && formData.travelDateTo
    ? Math.round((new Date(formData.travelDateTo).getTime() - new Date(formData.travelDateFrom).getTime()) / (1000 * 3600 * 24))
    : 0

  if (submitStatus === "success") {
    return (
      <div className="py-12 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Enquiry Received!</h2>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Thank you for reaching out to Kekeo Safaris. Our team will review your travel details and send you a custom itinerary within <strong>24 hours</strong>.
        </p>
        <Button onClick={() => setSubmitStatus("idle")} variant="outline" size="lg">
          Submit Another Enquiry
        </Button>
      </div>
    )
  }

  return (
    <Card className="shadow-xl border-border bg-card text-card-foreground">
      <CardContent className="p-6 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Personal Information Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <span>👤</span> Your Details
            </h2>
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
                <Label htmlFor="phone">Phone / WhatsApp</Label>
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
                  placeholder="e.g. United States, Germany, Kenya"
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="e.g. American, German, British (helps with visa guidance)"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Tour Selection Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <span>🦁</span> Safari / Tour Route
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="selectedTour">Preferred Safari Route *</Label>
                <Select
                  value={formData.selectedTour}
                  onValueChange={(value) => setFormData({ ...formData, selectedTour: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your preferred safari route" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map((tour) => (
                      <SelectItem key={tour.id} value={tour.name}>
                        {tour.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Exact Travel Dates & Range Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <Calendar className="h-6 w-6" /> Travel Dates & Duration
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="travelDateFrom">Arrival Date</Label>
                <Input
                  id="travelDateFrom"
                  type="date"
                  value={formData.travelDateFrom}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, travelDateFrom: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="travelDateTo">Departure Date</Label>
                <Input
                  id="travelDateTo"
                  type="date"
                  value={formData.travelDateTo}
                  min={formData.travelDateFrom || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, travelDateTo: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Date Flexibility</Label>
                <RadioGroup
                  value={formData.flexibility}
                  onValueChange={(value) => setFormData({ ...formData, flexibility: value })}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="font-normal cursor-pointer text-sm">
                      Fixed dates
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="flexible" />
                    <Label htmlFor="flexible" className="font-normal cursor-pointer text-sm">
                      Flexible (± 1 week)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="open" id="open" />
                    <Label htmlFor="open" className="font-normal cursor-pointer text-sm">
                      Open / Undecided
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Trip duration indicator */}
            {tripDays > 0 && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
                <span className="text-xl">📅</span>
                <span className="text-sm font-medium text-foreground">
                  Estimated Trip Duration: <strong>{tripDays} days</strong>
                </span>
              </div>
            )}
          </div>

          {/* Group Details Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <Users className="h-6 w-6" /> Who's Traveling?
            </h2>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="children">Number of Children (under 16)</Label>
                <Select
                  value={formData.children}
                  onValueChange={(value) => setFormData({ ...formData, children: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((num) => (
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

          {/* Accommodation Preference Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <span>🏕️</span> Accommodation Preference
            </h2>
            <RadioGroup
              value={formData.accommodationStyle}
              onValueChange={(value) => setFormData({ ...formData, accommodationStyle: value })}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-card">
                <RadioGroupItem value="budget" id="budget" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="budget" className="font-semibold cursor-pointer text-foreground">
                    Budget Camping
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Basic tented camps with shared or private facilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-card">
                <RadioGroupItem value="mid-range" id="mid-range" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="mid-range" className="font-semibold cursor-pointer text-foreground">
                    Mid-Range Lodges & Tented Camps
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Comfortable lodges with full private amenities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-card">
                <RadioGroupItem value="luxury" id="luxury" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="luxury" className="font-semibold cursor-pointer text-foreground">
                    Luxury Safari Lodges & Luxury Tented Suites
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Premium lodges with gourmet dining & exclusive views</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Special Interests Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <span>📷</span> Safari Interests
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries({
                wildlife: "Wildlife & Big Five Viewing",
                photography: "Photography Safari",
                birdwatching: "Bird Watching",
                culture: "Cultural & Maasai Interactions",
                adventure: "Adventure & Hiking Activities",
                relaxation: "Beach & Ocean Relaxation",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={key}
                    checked={formData.interests[key as keyof typeof formData.interests]}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        interests: { ...formData.interests, [key]: Boolean(checked) },
                      })
                    }
                  />
                  <Label htmlFor={key} className="cursor-pointer flex-1 text-sm font-medium">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="border-t border-border pt-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <span>📝</span> Additional Details & Preferences
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">Approximate Budget per Person (USD)</Label>
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. $2,000 - $4,000 per person"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="specialOccasion">Special Occasion</Label>
                  <Input
                    id="specialOccasion"
                    value={formData.specialOccasion}
                    onChange={(e) => setFormData({ ...formData, specialOccasion: e.target.value })}
                    placeholder="Honeymoon, Birthday, Anniversary, etc."
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dietaryRequirements">Dietary Requirements or Allergies</Label>
                <Input
                  id="dietaryRequirements"
                  value={formData.dietaryRequirements}
                  onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                  placeholder="Vegetarian, vegan, gluten-free, allergies, etc."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="message">Tell Us More About Your Dream Safari *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share any specific wildlife you dream of seeing, pace preferences, camera gear, or any questions you have..."
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>{errorMessage || "We couldn't submit your enquiry. Please try again or email us directly."}</div>
            </div>
          )}

          {/* Submit Button */}
          <div className="border-t border-border pt-10">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto px-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-3" />
                  Sending Your Enquiry...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-3" />
                  Submit Safari Enquiry
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              🔒 By submitting, your information is sent directly to our safari team. We respect your privacy.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">
            Begin Your Safari Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Share your travel vision with us. Every safari is unique, crafted around your interests, pace, and dreams.
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="p-12 text-center bg-card text-card-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading Enquiry Form...</p>
            </Card>
          }
        >
          <InquiryFormContent />
        </Suspense>
      </div>
    </div>
  )
}
