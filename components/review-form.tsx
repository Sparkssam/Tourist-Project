"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Send, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ReviewForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    tour: "",
    rating: 0,
    review: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Save review to Supabase reviews table with pending status
      const { error } = await supabase
        .from('reviews')
        .insert({
          name: formData.name,
          email: formData.email,
          location: formData.location || null,
          tour: formData.tour || null,
          rating: formData.rating,
          review: formData.review,
          status: 'pending' // Admin must approve before it shows publicly
        })

      if (error) throw error

      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        location: "",
        tour: "",
        rating: 0,
        review: "",
      })

      // Clear success message after 8 seconds
      setTimeout(() => setSubmitStatus("idle"), 8000)
    } catch (error) {
      console.error("Error submitting review:", error)
      setSubmitStatus("error")
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-luxury text-primary">Share Your Experience</CardTitle>
            <p className="text-muted-foreground">
              Help other travelers by sharing your safari adventure with KEKEOsafaris
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tour Taken</label>
                  <Select value={formData.tour} onValueChange={(value) => setFormData({ ...formData, tour: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your tour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serengeti-safari">Serengeti Safari</SelectItem>
                      <SelectItem value="kilimanjaro-climb">Kilimanjaro Climb</SelectItem>
                      <SelectItem value="ngorongoro-crater">Ngorongoro Crater</SelectItem>
                      <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
                      <SelectItem value="photography-safari">Photography Safari</SelectItem>
                      <SelectItem value="family-safari">Family Safari</SelectItem>
                      <SelectItem value="custom-tour">Custom Tour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review *</label>
                <Textarea
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Tell us about your experience with KEKEOsafaris. What made it special? What would you tell other travelers?"
                  rows={5}
                />
              </div>

              {submitStatus === "success" && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Thank you for your review! It will be published after admin approval.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>
                    There was an error submitting your review. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || formData.rating === 0}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
